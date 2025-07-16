import random
import json
import logging
import math
from collections import defaultdict

# Assuming src.env.cloud_env is correctly set up
from src.env.cloud_env import CloudEnvironment

# Logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s:%(message)s')

class QLearningAgent:
    """Optimized Q-learning agent for VM consolidation with scalable state representation and efficient action selection."""

    def __init__(self,
                 alpha=0.1,
                 gamma=0.9,
                 episodes=2000,
                 time_steps_per_episode=50,
                 num_bins=5):
        # Learning rate parameters
        self.initial_alpha = alpha
        self.alpha = alpha
        self.alpha_decay = 0.0001  # Tiny decay per episode

        # Discount factor
        self.gamma = gamma

        # Epsilon-greedy parameters
        self.max_epsilon = 1.0
        self.min_epsilon = 0.01
        self.decay_rate = 0.005  # Exponential decay rate
        self.epsilon = self.max_epsilon

        # Training schedule
        self.episodes = episodes
        self.time_steps = time_steps_per_episode

        # State representation parameters
        self.num_bins = num_bins  # Number of utilization bins (e.g., 0-20%, 20-40%, etc.)

        self.q_table = defaultdict(lambda: defaultdict(float))
        self.env = CloudEnvironment()
        self.episode_rewards = []

    def load_q_table(self, filename="q_table_consolidated.json"):
        """Loads the Q-table from a JSON file."""
        try:
            with open(filename, "r") as f:
                data = json.load(f)
                self.q_table = defaultdict(lambda: defaultdict(float))
                for state_str, actions in data.items():
                    state = eval(state_str)
                    self.q_table[state] = defaultdict(
                        float, {eval(act): val for act, val in actions.items()}
                    )
                logging.info("✅ Q-table loaded with %d states", len(self.q_table))
        except (FileNotFoundError, json.JSONDecodeError):
            logging.warning("⚠️ No existing Q-table found; starting fresh.")

    def save_q_table(self, filename="q_table_consolidated.json"):
        """Saves the Q-table to a JSON file."""
        string_q = {
            str(state): {str(act): val for act, val in actions.items()}
            for state, actions in self.q_table.items()
        }
        with open(filename, "w") as f:
            json.dump(string_q, f, indent=2)
        logging.info("📁 Q-table saved with %d states", len(self.q_table))

    def get_hosts_by_bins(self):
        """Groups hosts into utilization bins based on CPU utilization."""
        bin_edges = [i / self.num_bins for i in range(self.num_bins + 1)]
        hosts_by_bin = [[] for _ in range(self.num_bins)]
        for host in self.env.hosts:
            util = host.get_cpu_utilization() if host.vms else 0.0
            bin_idx = min(int(util * self.num_bins), self.num_bins - 1)
            hosts_by_bin[bin_idx].append(host)
        return hosts_by_bin

    def get_state(self):
        """Returns the state as a tuple of host counts in each utilization bin."""
        hosts_by_bin = self.get_hosts_by_bins()
        return tuple(len(bin_hosts) for bin_hosts in hosts_by_bin)

    def get_action(self, state, hosts_by_bin):
        """Chooses an action (bin_from, bin_to) using epsilon-greedy policy with heuristic-guided exploration."""
        if random.random() < self.epsilon:
            # Exploration: Score (bin_from, bin_to) pairs based on immediate reward
            scored_actions = []
            for bin_from in range(self.num_bins):
                for bin_to in range(self.num_bins):
                    if bin_from == bin_to or not hosts_by_bin[bin_from] or not hosts_by_bin[bin_to]:
                        continue
                    # Sample one migration
                    src = random.choice(hosts_by_bin[bin_from])
                    vm = min(src.vms, key=lambda v: v.cpu_req, default=None) if src.vms else None
                    if not vm:
                        continue
                    dst_candidates = [h for h in hosts_by_bin[bin_to] if h.can_host(vm)]
                    if not dst_candidates:
                        continue
                    dst = random.choice(dst_candidates)
                    before = self.env.get_metrics()
                    success = self.env.simulate_migration(src.id, dst.id, vm)
                    after = self.env.get_metrics()
                    reward = self.calculate_reward(before, after, not success)
                    self.env.rollback()
                    scored_actions.append(((bin_from, bin_to), reward))
            if not scored_actions:
                return None
            # Select randomly among top-5 actions
            scored_actions.sort(key=lambda x: x[1], reverse=True)
            top_actions = scored_actions[:min(5, len(scored_actions))]
            return random.choice(top_actions)[0]
        else:
            # Exploitation: Choose action with highest Q-value
            if state in self.q_table and self.q_table[state]:
                return max(self.q_table[state], key=self.q_table[state].get)
            # Fallback: Random valid action
            valid_pairs = [
                (bin_from, bin_to)
                for bin_from in range(self.num_bins)
                for bin_to in range(self.num_bins)
                if bin_from != bin_to and hosts_by_bin[bin_from] and hosts_by_bin[bin_to]
            ]
            return random.choice(valid_pairs) if valid_pairs else None

    def calculate_reward(self, before, after, failed):
        """
        Calculates the reward with terms to encourage consolidation and energy savings:
        - Penalty for migration failures
        - Bonuses for power savings and host shutdowns
        - Penalties for active hosts, idle hosts, and SLA violations
        - Bonus for optimal utilization
        """
        if failed:
            return -50

        power_before = before['total_power_consumption']
        power_after = after['total_power_consumption']
        power_saved_pct = ((power_before - power_after) / max(power_before, 1)) * 100

        shutdown_bonus = 1000 * max(0, before['active_hosts'] - after['active_hosts'])

        migration_cost = 1 + getattr(before, 'last_vm_cpu_req', 1) * 0.5

        sla_penalty = -100 * after['sla_violations']

        idle_penalty = sum(20 for h in self.env.hosts if getattr(h, "idle_steps", 0) > 5)

        active_host_penalty = -20 * after['active_hosts']

        util = after.get('cpu_utilization', 0)
        util_bonus = -abs(util - 0.75) * 50

        return (
            power_saved_pct
            + shutdown_bonus
            - migration_cost
            + sla_penalty
            - idle_penalty
            + active_host_penalty
            + util_bonus
        )

    def train(self):
        """Trains the Q-learning agent with decay scheduling and scalable state-action handling."""
        for ep in range(1, self.episodes + 1):
            self.env.reset()
            state = self.get_state()
            total_reward = 0

            for _ in range(self.time_steps):
                hosts_by_bin = self.get_hosts_by_bins()
                action = self.get_action(state, hosts_by_bin)
                if action is None:
                    break

                bin_from, bin_to = action
                src_candidates = [h for h in hosts_by_bin[bin_from] if h.vms]
                if not src_candidates:
                    continue
                src = max(src_candidates, key=lambda h: h.get_cpu_utilization())
                vm = min(src.vms, key=lambda v: v.cpu_req, default=None)
                if not vm:
                    continue
                dst_candidates = [h for h in hosts_by_bin[bin_to] if h.can_host(vm)]
                if not dst_candidates:
                    continue
                dst = min(dst_candidates, key=lambda h: h.get_cpu_utilization())

                before = self.env.get_metrics()
                before['last_vm_cpu_req'] = vm.cpu_req
                migrated = self.env.migrate_vm(vm, dst)
                after = self.env.get_metrics()

                reward = self.calculate_reward(before, after, not migrated)
                total_reward += reward

                self.env.tick_idle_counters()
                next_state = self.get_state()

                old_q = self.q_table[state][action]
                future_q = max(self.q_table[next_state].values()) if self.q_table[next_state] else 0.0
                self.q_table[state][action] = old_q + self.alpha * (reward + self.gamma * future_q - old_q)

                state = next_state

            # Decay alpha and epsilon
            self.alpha = max(0.01, self.initial_alpha / (1 + self.alpha_decay * ep))
            self.epsilon = self.min_epsilon + \
                (self.max_epsilon - self.min_epsilon) * math.exp(-self.decay_rate * ep)

            self.episode_rewards.append(total_reward)

            if ep % 50 == 0:
                avg = sum(self.episode_rewards[-50:]) / 50
                logging.info(f"📊 Episode {ep}: Avg Reward (last 50) = {avg:.2f}, ε = {self.epsilon:.3f}")

    def get_learning_curve(self):
        """Returns the total rewards per episode."""
        return self.episode_rewards

if __name__ == "__main__":
    agent = QLearningAgent()
    agent.load_q_table()
    logging.info("Starting Q-learning training...")
    agent.train()
    agent.save_q_table()
    logging.info("Q-learning training complete.")