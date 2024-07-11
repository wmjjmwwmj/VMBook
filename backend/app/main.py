import sys
import os

# Add the project root directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from models import get_db
import api.endpoints

app = FastAPI()

# Your FastAPI app setup code here
app.include_router(api.endpoints.router)

# Example of using the get_db function
@app.get("/")
async def root():
    db = next(get_db())
    # Use db to query your database
    return {"message": "Welcome to VMBook!"}


if __name__ == "__main__":

    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)