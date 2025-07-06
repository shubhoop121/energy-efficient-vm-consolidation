# backend/src/agent/q_learning.py

import random
import numpy as np
from collections import defaultdict
from src.env.cloud_env import CloudEnvironment

class QLearningAgent:
    def __init__(self, alpha=0.1, gamma=0.9, epsilon=0.2, episodes=100):
        self.alpha = alpha
        self.gamma = gamma
        self.epsilon = epsilon
        self.episodes = episodes
        self.q_table = defaultdict(float)
        self.env = CloudEnvironment()

    def choose_action(self, state, actions):
        if random.random() < self.epsilon:
            return random.choice(actions)
        q_values = [self.q_table[(state, a)] for a in actions]
        max_q = max(q_values)
        best_actions = [a for a, q in zip(actions, q_values) if q == max_q]
        return random.choice(best_actions)

    def get_possible_actions(self):
        # List of (vm_id, target_host_id)
        return [(vm.vm_id, host.host_id) for vm in self.env.vms for host in self.env.hosts]

    def simulate(self):
        self.env.reset()
        self.env.allocate_initial()

        for ep in range(self.episodes):
            state = str(self.env.get_state())
            actions = self.get_possible_actions()
            action = self.choose_action(state, actions)

            # Decode action
            vm_id, target_host_id = action
            vm = self.env.vms[vm_id]
            target_host = self.env.hosts[target_host_id]

            # Try migration
            current_host = self.env.hosts[vm.host_id] if vm.host_id is not None else None
            if current_host:
                current_host.remove_vm(vm)
            success = target_host.assign_vm(vm)

            reward = self.calculate_reward(success)
            next_state = str(self.env.get_state())

            # Update Q-value
            old_q = self.q_table[(state, action)]
            max_future_q = max([self.q_table[(next_state, a)] for a in actions], default=0)
            new_q = old_q + self.alpha * (reward + self.gamma * max_future_q - old_q)
            self.q_table[(state, action)] = new_q

        return self.generate_metrics()

    def calculate_reward(self, success):
        # Placeholder: reward successful migration
        return 10 if success else -5

    def generate_metrics(self):
        return {
            "energy_saved": random.randint(10, 30),  # Placeholder logic
            "migrations": random.randint(5, 20),
            "sla_violations": random.randint(0, 3),
            "avg_utilization": round(random.uniform(0.6, 0.9), 2)
        }
