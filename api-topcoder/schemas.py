from pydantic import BaseModel
class Item (BaseModel):
    handle : str
    firstName : str
    lastName : str
    city : str
    email : str
    
    