def init_database(app, db):
    from models import Item, Category, User
    """Initialize database with tables and sample data"""
    with app.app_context():
        # Create all tables
        db.create_all()
        print("Database tables created successfully!")
        
        # Add sample data only if database is empty
        if Item.query.count() == 0:
            print("Adding sample data...")
            
            # Create categories
            fruits = Category(name="Fruits")
            bakery = Category(name="Bakery")
            dairy = Category(name="Dairy")
            
            
            # Save them into the Database
            db.session.add_all([fruits, bakery, dairy])
            db.session.commit()
            
            # Create items with matching categories
            items = [
                Item(name="Apple", price=1.99, amount=50, category_id=fruits.id),
                Item(name="Bread", price=2.49, amount=30, category_id=bakery.id),
                Item(name="Milk", price=3.99, amount=20, category_id=dairy.id)
            ]
            
            # Save them into the database 
            db.session.add_all(items)
            db.session.commit()
            print("Sample items added successfully!")
        else:
            print("Database already contains items. Skipping sample items creation.")
        
        # Add sample users only if no users exist
        if User.query.count() == 0:
            print("Adding sample users...")
            
            users = [
                User(email="admin@example.com", password="admin123"),
                User(email="user@example.com", password="user123"),
                User(email="test@test.com", password="password")
            ]
            
            db.session.add_all(users)
            db.session.commit()
            print("Sample users added successfully!")
        else:
            print("Database already contains users. Skipping sample users creation.")

if __name__ == "__main__":
    init_database()