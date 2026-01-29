from flask import Blueprint, request, jsonify
from models import CartItem
from database import db
from auth import token_required

cart_bp = Blueprint('cart', __name__)

@cart_bp.route("/cart", methods=["POST"])
@token_required
def add_to_cart():
    data = request.get_json()
    item_id = data.get("item_id")
    quantity = data.get("quantity", 1)
    
    # If item ID was not provided.
    if not item_id:
        return jsonify({"msg": "item_id required"}), 400
    
    # Check if item already exists in cart
    existing_cart_item = CartItem.query.filter_by(
        user_id=request.user_id,
        item_id=item_id
    ).first()
    
    if existing_cart_item:
        # Update quantity if item already in cart
        existing_cart_item.quantity += quantity
        db.session.commit()
        return jsonify({"msg": "Item quantity updated in cart"}), 200
    
    # Add new item to cart
    cart_item = CartItem(
        user_id=request.user_id,
        item_id=item_id,
        quantity=quantity
    )
    
    db.session.add(cart_item)
    db.session.commit()
    
    return jsonify({"msg": "Item added to cart"}), 201

@cart_bp.route("/cart", methods=["GET"])
@token_required
def get_cart():
    cart_items = CartItem.query.filter_by(user_id=request.user_id).all()
    
    cart_list = [
        {
            "id": cart_item.id,
            "item_id": cart_item.item_id,
            "item_name": cart_item.item.name,
            "price": cart_item.item.price,
            "quantity": cart_item.quantity
        }
        for cart_item in cart_items
    ]
    
    return jsonify(cart_list), 200

@cart_bp.route("/cart/<int:cart_item_id>", methods=["DELETE"])
@token_required
def remove_from_cart(cart_item_id):
    cart_item = CartItem.query.filter_by(
        id=cart_item_id,
        user_id=request.user_id
    ).first()
    
    if not cart_item:
        return jsonify({"msg": "Cart item not found"}), 404
    
    db.session.delete(cart_item)
    db.session.commit()
    
    return jsonify({"msg": "Item removed from cart"}), 200

@cart_bp.route("/cart/<int:cart_item_id>", methods=["PUT"])
@token_required
def update_cart_quantity(cart_item_id):
    data = request.get_json()
    quantity = data.get("quantity")
    
    if not quantity or quantity < 1:
        return jsonify({"msg": "Valid quantity required"}), 400
    
    cart_item = CartItem.query.filter_by(
        id=cart_item_id,
        user_id=request.user_id
    ).first()
    
    if not cart_item:
        return jsonify({"msg": "Cart item not found"}), 404
    
    cart_item.quantity = quantity
    db.session.commit()
    
    return jsonify({"msg": "Quantity updated"}), 200

@cart_bp.route("/checkout", methods=["POST"])
@token_required
def checkout():
    # Delete all cart items for the user
    CartItem.query.filter_by(user_id=request.user_id).delete()
    db.session.commit()
    
    return jsonify({"msg": "Checkout successful"}), 200