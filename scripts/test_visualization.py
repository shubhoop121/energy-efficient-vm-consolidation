
import random
import sys
import os
import json
import matplotlib.pyplot as plt
from collections import defaultdict

# Add the path to the agent
base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "src", "agent"))
sys.path.insert(0, base_path)

from q_learning import QLearningAgent

class VisualQLearningAgent(QLearningAgent):
    def simulate_with_logging(self):
        self.rewards_per_episode = []
        for ep in range(self.episodes):
            total_reward = 0
            state = self.generate_fake_state()
            actions = self.get_possible_actions()
            action = self.choose_action(state, actions)
            vm_id, target_host_id = action

            migration_happened = random.random() < 0.6
            sla_violation = random.random() < 0.1
            utilization = random.uniform(0.5, 0.95)

            reward = self.calculate_reward(migration_happened, sla_violation, utilization)
            total_reward += reward
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

            self.rewards_per_episode.append(total_reward)

        return self.generate_metrics()

# ✅ Run and plot
agent = VisualQLearningAgent(alpha=0.1, gamma=0.95, epsilon=0.1, episodes=1000)
agent.load_q_table()
metrics = agent.simulate_with_logging()
agent.save_q_table()

print("✅ Metrics:", metrics)

# ✅ Plot reward trend
plt.plot(agent.rewards_per_episode)
plt.title("Reward per Episode")
plt.xlabel("Episode")
plt.ylabel("Reward")
plt.grid(True)
plt.tight_layout()
plt.savefig("reward_plot.png")
plt.show()
