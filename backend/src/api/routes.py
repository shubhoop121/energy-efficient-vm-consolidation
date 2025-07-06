from flask import Blueprint, request, jsonify

api_blueprint = Blueprint('api', __name__)

# Dummy response for /simulate
@api_blueprint.route('/simulate', methods=['POST'])
def simulate():
    data = request.json

    # TODO: Call Q-Learning engine here
    print("Simulation Input Received:", data)

    return jsonify({"message": "Simulation started", "status": "success"}), 200

# Dummy response for /results
@api_blueprint.route('/results', methods=['GET'])
def results():
    dummy_results = {
        "energy_saved": "25%",
        "vm_migrations": 42,
        "sla_violations": 2,
        "avg_utilization": "78%"
    }
    return jsonify(dummy_results)
