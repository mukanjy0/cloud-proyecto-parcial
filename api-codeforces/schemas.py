from pydantic import BaseModel

class User(BaseModel):
    handle: str
    email: str
    openId: str
    firstName: str
    lastName: str
    country: str
    city: str
    organization: str
    contribution: int
    rank: str
    rating: int
    maxRank: str
    maxRating: int
    registrationTimeSeconds: int
    friendOfCount: int
    avatar: str
    titlePhoto: str
