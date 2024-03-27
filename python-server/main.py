from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
"https://silver-robot-9qgj464r4xvc9r9r-3000.app.github.dev"
]

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
    allow_headers=['Content-Type', 'Authorization']
)

client = MongoClient("mongodb://localhost:27017/", username="root", password="password")
db = client["user_database"]
collection = db["users"]

class UserIn(BaseModel):
    username: str
    password: str
    email: str
    phone_number: str

class UserOut(BaseModel):
    username: str
    email: str
    phone_number: str

@app.post("/register/", response_model=UserOut)
async def register_user(user_in: UserIn):
    existing_username = collection.find_one({"username": user_in.username})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already exists")

    existing_email = collection.find_one({"email": user_in.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    existing_phone_number = collection.find_one({"phone_number": user_in.phone_number})
    if existing_phone_number:
        raise HTTPException(status_code=400, detail="Phone number already exists")

    new_user = collection.insert_one(user_in.dict())
    return new_user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
