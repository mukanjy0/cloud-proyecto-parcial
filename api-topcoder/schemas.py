from pydantic import BaseModel
class Item (BaseModel):
    name : str
    apellidos : str
    ciudad : str
    correo : str
    tc_name : str
    
    