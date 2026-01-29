from flask import Blueprint, request, jsonify, current_app
from models import User
from database import db
import jwt
from datetime import datetime, timedelta
from auth import token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/")
@token_required  
def home():
    return f"<p> Welcome user. You have a token.</p>"

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # Credentials validation
    if not email or not password:
        return jsonify({"msg": "Email and password required"}), 400

    # Make sure user doesn't exist already
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User already exists"}), 409

    user = User(email=email, password=password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(force=True)
    email = data.get("email")
    password = data.get("password")

    # Checks in the database if data provided exists in it
    user = User.query.filter_by(email=email, password=password).first()
    if not user:
        return jsonify({"msg": "User doesn't exist in database."}), 401


    token = jwt.encode(
        {
            "user_id": user.id,
            "exp": datetime.utcnow() + timedelta(hours=1)
        },
        current_app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return jsonify({"msg": "Login successful", "token": token}), 200