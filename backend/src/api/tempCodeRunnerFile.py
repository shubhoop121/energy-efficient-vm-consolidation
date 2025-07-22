from flask import Blueprint, request, jsonify
from src.agent.q_learning import QLearningAgent

api_blueprint = Blueprint('api', __name__)

# POST /simulate — Run the Q-learning simulation
@api_blueprint.route('/simulate', methods=['POST'])
def simulate():
    data = request.json
    print("Simulation Input Received:", data)

    # Optional: Use values from frontend if needed
    alpha = data.get('alpha', 0.1)
    gamma = data.get('gamma', 0.9)
    epsilon = data.get('epsilon', 0.2)
    episodes = data.get('episodes', 100)

    # Run Q-Learning simulation
    agent = QLearningAgent(alpha=alpha, gamma=gamma, epsilon=epsilon, episodes=episodes)
    metrics = agent.simulate()

    return jsonify({
        "message": "Simulation completed",
        "metrics": metrics,
        "status": "success"
    }), 200

# GET /results — Currently returns last metrics (or placeholder)
@api_blueprint.route('/results', methods=['GET'])
def results():
    # This can be replaced to read from file/db later if persistent
    dummy_results = {
        "energy_saved": "25%",
        "vm_migrations": 42,
        "sla_violations": 2,
        "avg_utilization": "78%"
    }
    return jsonify(dummy_results)
