from flask import Blueprint, request, jsonify
from src.agent.q_learning import QLearningAgent  # ✅ Integrated agent with cloud_env

api_blueprint = Blueprint('api', __name__)

# POST /simulate — Run the Q-learning simulation
@api_blueprint.route('/simulate', methods=['GET', 'POST'])
def simulate():
    if request.method == 'GET':
        return jsonify({"message": "Use POST method to run simulation"}), 200

    data = request.json or {}
    print("✅ Simulation Input Received:", data)

    # Optional frontend parameters
    alpha = data.get('alpha', 0.1)
    gamma = data.get('gamma', 0.95)
    epsilon = data.get('epsilon', 0.2)
    episodes = data.get('episodes', 100)

    # 🧠 Initialize and run agent
    agent = QLearningAgent(alpha=alpha, gamma=gamma, epsilon=epsilon, episodes=episodes)
    agent.load_q_table()
    metrics = agent.simulate()
    agent.save_q_table()

    return jsonify({
        "message": "Simulation completed",
        "metrics": metrics,
        "status": "success"
    }), 200


# GET /results — Placeholder for future result caching
@api_blueprint.route('/results', methods=['GET'])
def results():
    dummy_results = {
        "energy_saved": "25%",
        "vm_migrations": 42,
        "sla_violations": 2,
        "avg_utilization": "78%"
    }
    return jsonify(dummy_results)
