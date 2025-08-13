from flask import Blueprint, jsonify, request
from src.agent.q_learning import QLearningAgent

import random
from flask import Blueprint, jsonify


routes = Blueprint("routes", __name__)
agent = QLearningAgent()

@routes.route("/")
def index():
    return jsonify({"message": "Q-Learning VM Consolidation API is active!"})




@routes.route("/run-single", methods=["POST"])
def run_single_episode():
    try:
        agent.env.reset()
        agent.train()
        metrics = agent.env.get_metrics()
        return jsonify({
            "message": "Single training run complete.",
            "metrics": metrics,
            "avg_reward": sum(agent.get_learning_curve()) / len(agent.get_learning_curve())
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@routes.route("/batch", methods=["POST"])
def batch_run():
    data = request.get_json(force=True)
    episodes = data.get("episodes", 500)
    runs = data.get("runs", 10)
    time_steps = data.get("time_steps", 50)

    try:
        from backend.batch_test import run_batch_simulations
        results = run_batch_simulations(
            num_runs=runs,
            episodes=episodes,
            time_steps=time_steps,
            alpha=0.1,
            gamma=0.9,
            epsilon=0.9
        )
        return jsonify({
            "message": f"Batch completed with {runs} runs.",
            "results": results
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@routes.route("/qtable", methods=["GET"])
def get_qtable():
    try:
        q_table_data = {
            str(k): {str(a): q for a, q in v.items()}
            for k, v in agent.q_table.items()
        }
        return jsonify(q_table_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@routes.route("/train-custom", methods=["POST"])
def train_custom():
    try:
        global agent  
        data = request.get_json(force=True)

        alpha = data.get("alpha", 0.1)
        gamma = data.get("gamma", 0.9)
        episodes = data.get("episodes", 2000)
        time_steps = data.get("time_steps", 50)

        # Reinitialize the global agent with new config
        agent = QLearningAgent(
            alpha=alpha,
            gamma=gamma,
            episodes=episodes,
            time_steps_per_episode=time_steps
        )

        agent.train()

        metrics = agent.env.get_metrics()
        rewards = agent.get_learning_curve()
        avg_reward = sum(rewards) / len(rewards) if rewards else 0

        return jsonify({
            "message": "Custom training completed.",
            "episodes": episodes,
            "time_steps": time_steps,
            "alpha": alpha,
            "gamma": gamma,
            "metrics": metrics,
            "avg_reward": avg_reward
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    
    # Learning curve
@routes.route("/learning-curve", methods=["GET"])
def get_learning_curve():
    """
    Returns the reward earned in each episode during training.
    Useful for plotting how the agent's performance improves over time.
    """
    try:
        rewards = agent.get_learning_curve()

        if not rewards:
            return jsonify({
                "message": "No training data found. Please run training first.",
                "episode_rewards": []
            }), 200

        return jsonify({
            "message": "Episode reward curve retrieved successfully.",
            "total_episodes": len(rewards),
            "average_reward": sum(rewards) / len(rewards),
            "episode_rewards": rewards
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@routes.route("/server-health", methods=["GET"])
def server_health():
    """
    Returns live simulation data for 6 servers.
    Status:
        - Healthy: CPU < 70% and RAM < 70%
        - Warning: 70% <= CPU < 90% or RAM >= 70%
        - Critical: CPU >= 90% or RAM >= 90%
    """
    servers = []
    for i in range(1, 7):
        cpu = random.randint(0, 100)
        ram = random.randint(0, 100)
        
        if cpu >= 90 or ram >= 90:
            status = "Critical"
        elif cpu >= 70 or ram >= 70:
            status = "Warning"
        else:
            status = "Healthy"

        servers.append({
            "name": f"Server-{i}",
            "cpu": cpu,
            "ram": ram,
            "status": status
        })

    return jsonify({
        "message": "Live server health data",
        "servers": servers
    })