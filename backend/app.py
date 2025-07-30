from flask import Flask, jsonify
from flask_cors import CORS
from src.api.routes import routes

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register all routes
    app.register_blueprint(routes, url_prefix="/api")

    @app.route("/health")
    def health_check():
        return jsonify({
            "status": "ok",
            "message": "Q-Learning Backend is running",
            "version": "1.0.1"
        })

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)
