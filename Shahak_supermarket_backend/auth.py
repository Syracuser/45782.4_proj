from functools import wraps
from flask import request, jsonify, current_app
import jwt

def token_required(f):
    """
    Decorator to protect routes using JWT.
    Uses current_app.config['SECRET_KEY'] at runtime.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"msg": "Token missing"}), 401

        if token.startswith("Bearer "):
            token = token[7:]  # strip "Bearer "

        try:
            # Use Flask's current_app to get the secret key dynamically
            data = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            request.user_id = data["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"msg": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"msg": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated
