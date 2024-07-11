import sys
import os

# Add the project root directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import Base, engine

def create_tables(): # Create all tables in the database, overwriting existing tables
    # overwriting existing tables
    Base.metadata.drop_all(bind=engine)
    
    Base.metadata.create_all(bind=engine)
    print("All tables created successfully!")

if __name__ == "__main__":
    create_tables()