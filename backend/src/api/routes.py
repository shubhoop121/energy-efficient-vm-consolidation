from flask import Blueprint, jsonify, request
from src.agent.q_learning import QLearningAgent

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
