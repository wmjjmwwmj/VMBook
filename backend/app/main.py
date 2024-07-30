import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from database import get_db
from api import router

app = FastAPI()

# Your FastAPI app setup code here
app.include_router(router)

# Example of using the get_db function
@app.get("/")
async def root():
    db = next(get_db())
    # Use db to query your database
    return {"message": "Welcome to VMBook!"}


if __name__ == "__main__":

    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    # or run with `uvicorn main:app --reload` in the terminal
    