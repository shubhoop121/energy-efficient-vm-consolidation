import requests
import matplotlib.pyplot as plt

# Fetch learning curve data
url = "http://localhost:5000/api/learning-curve"
response = requests.get(url)
data = response.json()

# Extract rewards
rewards = data.get("episode_rewards", [])

if not rewards:
    print("No training data found. Run training first.")
else:
    # Plot learning curve
    plt.figure(figsize=(10, 5))
    plt.plot(range(1, len(rewards) + 1), rewards, label="Reward per Episode", color="blue")
    plt.xlabel("Episode")
    plt.ylabel("Reward")
    plt.title("Q-Learning Agent Learning Curve")
    plt.grid(True)
    plt.legend()
    plt.show()
