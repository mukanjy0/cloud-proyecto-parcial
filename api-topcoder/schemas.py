from pydantic import BaseModel
class Item (BaseModel):
    handle : str
    firstName : str
    lastName : str
    city : str
    email : str
    
class Submission(BaseModel):
    id: int
    status: str
    problem: str
    problem_url: str
    user_handle: str

class SubmissionCreate(BaseModel):
    status: str
    problem: str
    problem_url: str
    user_handle: str
    