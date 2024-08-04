import sys
import os
from pathlib import Path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from database import get_db
from api import router
import dotenv

dotenv.load_dotenv()
STATIC_PATH = os.getenv("STATIC_PATH")

app = FastAPI()

# Your FastAPI app setup code here
app.include_router(router)

app.mount("/static", StaticFiles(directory=Path(STATIC_PATH)), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Example of using the get_db function
@app.get("/")
async def root():
    db = next(get_db())
    # Use db to query your database
    return {"message": "Welcome to VMBook!"}


if __name__ == "__main__":

    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    # or run with `uvicorn main:app --reload --host 0.0.0.0` in the terminal
    