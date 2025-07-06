from flask import Flask
from src.api.routes import api_blueprint
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows React frontend to call backend

# Register API routes
app.register_blueprint(api_blueprint, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
