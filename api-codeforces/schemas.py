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

class Submission(BaseModel):
    id: int
    status: str
    problem: str
    url_problem: str
    user_handle: str

class SubmissionCreate(BaseModel):
    status: str
    problem: str
    url_problem: str
    user_handle: str