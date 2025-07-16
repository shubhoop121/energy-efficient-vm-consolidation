from flask import Flask
from src.api.routes import api_blueprint  # ✅ Make sure this path matches your project

app = Flask(__name__)

# ✅ Register Blueprint
app.register_blueprint(api_blueprint, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
