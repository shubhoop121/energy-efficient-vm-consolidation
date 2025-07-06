
import random
import json
from collections import defaultdict

class QLearningAgent:
    def __init__(self, alpha=0.1, gamma=0.9, epsilon=0.1, episodes=1000):
        self.alpha = alpha
        self.gamma = gamma
        self.epsilon = epsilon
        self.episodes = episodes
        self.q_table = defaultdict(float)
        self.migration_count = 0
        self.sla_violations = 0
        self.utilization_log = []

    def choose_action(self, state, actions):
        if random.random() < self.epsilon:
            return random.choice(actions)
        q_values = [self.q_table[(state, a)] for a in actions]
        max_q = max(q_values)
        best_actions = [a for a, q in zip(actions, q_values) if q == max_q]
        return random.choice(best_actions)

    def get_possible_actions(self):
        return [(vm_id, host_id) for vm_id in range(5) for host_id in range(3)]

    def simulate(self):
        for ep in range(self.episodes):
            state = self.generate_fake_state()
            actions = self.get_possible_actions()
            action = self.choose_action(state, actions)

            vm_id, target_host_id = action

            migration_happened = random.random() < 0.6
            sla_violation = random.random() < 0.1
            utilization = random.uniform(0.5, 0.95)

            reward = self.calculate_reward(migration_happened, sla_violation, utilization)
            next_state = self.generate_fake_state()

            old_q = self.q_table[(state, action)]
            max_future_q = max([self.q_table[(next_state, a)] for a in actions], default=0)
            new_q = old_q + self.alpha * (reward + self.gamma * max_future_q - old_q)
            self.q_table[(state, action)] = new_q

            if migration_happened:
                self.migration_count += 1
            if sla_violation:
                self.sla_violations += 1
            self.utilization_log.append(utilization)

        return self.generate_metrics()

    def calculate_reward(self, migrated, sla_violated, utilization):
        reward = 0
        if not sla_violated:
            reward += 10
        else:
            reward -= 10
        if migrated:
            reward -= 2
        reward += utilization * 5
        return reward

    def generate_fake_state(self):
        return str([(random.randint(20, 80), random.randint(50, 150)) for _ in range(3)])

    def generate_metrics(self):
        avg_util = round(sum(self.utilization_log) / len(self.utilization_log), 2) if self.utilization_log else 0
        return {
            "energy_saved": random.randint(10, 30),
            "migrations": self.migration_count,
            "sla_violations": self.sla_violations,
            "avg_utilization": avg_util
        }

    def save_q_table(self, filename="q_table.json"):
        with open(filename, "w") as f:
            json.dump({str(k): v for k, v in self.q_table.items()}, f)

    def load_q_table(self, filename="q_table.json"):
        try:
            with open(filename, "r") as f:
                data = json.load(f)
                self.q_table = defaultdict(float, {eval(k): v for k, v in data.items()})
        except FileNotFoundError:
            pass
