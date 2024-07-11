from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()

# Create the database engine
user = 'root'
password = os.environ.get('DB_PASSWORD')
host = 'localhost'
port = '3306'
database = 'vmbookdb'

engine = create_engine(f'mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}')

# Create a session factory
SessionLocal = sessionmaker(bind=engine)

# Function to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()