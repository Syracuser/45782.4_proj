from flask import Blueprint, request, jsonify
from models import Item

items_bp = Blueprint('items', __name__)

@items_bp.route("/items", methods=["GET"])
def get_items():
    category = request.args.get("category")
    
    # Check if a category was provided.
    if category:
        items = Item.query.join(Item.category).filter_by(name=category.capitalize()).all()
    else:
        items = Item.query.all()
    
    # If Category was provided, show only the filtered by category items.
    # Otherwise, display all items in 'items' table
    items_list = [
        {
            "id": item.id,
            "name": item.name,
            "price": item.price,
            "amount": item.amount,
            "category": item.category.name
        }
        for item in items
    ]
    
    return jsonify(items_list), 200