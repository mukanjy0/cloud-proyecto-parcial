from pydantic import BaseModel

class User(BaseModel):
    handle: str
    email: str
    firstName: str
    lastName: str
    country: str
    city: str
    rank: str
    rating: int
