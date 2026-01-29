from flask_cors import CORS
from flask import Flask
from database import db
from init_db import init_database

# Import blueprints
from controllers.auth_controller import auth_bp
from controllers.items_controller import items_bp
from controllers.cart_controller import cart_bp

# Initialize Flask app enable CORS
app = Flask(__name__)
CORS(app)

# Configuration to the database/App
app.config["SECRET_KEY"] = "dev-secret-key"

# Ensure instance directory exists and use Flask's instance_path so it works on both Windows dev and inside Docker
import os
os.makedirs(app.instance_path, exist_ok=True)
# Attempt to set permissive permissions (no-op on Windows sometimes)
try:
    os.chmod(app.instance_path, 0o777)
except Exception:
    pass

# Use an absolute path to the database file so sqlite can open/create it reliably
db_path = os.path.join(app.instance_path, "supermarket.db")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# Initialize database with tables and sample data
init_database(app, db)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(items_bp)
app.register_blueprint(cart_bp)

if __name__ == "__main__":
    app.run(debug=True)