from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from typing import List, Dict, Any

app = FastAPI()

# Configuración de CORS para permitir todos los orígenes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos HTTP
    allow_headers=["*"],  # Permitir todos los encabezados
)

# Configuración de la base de datos
host_name = "3.221.35.104"
port_number = "8005"
user_name = "root"
password_db = "utec"
database_name = "atcoder"

# Definición del esquema User
class User(BaseModel):
    handle: str
    email: str
    rank: int
    rating: int

# Obtener todos los usuarios
@app.get("/users", response_model=List[User])
def get_users():
    try:
        mydb = mysql.connector.connect(
            host=host_name,
            port=port_number,
            user=user_name,
            password=password_db,
            database=database_name
        )
        cursor = mydb.cursor(dictionary=True)
        cursor.execute("SELECT * FROM user")
        result = cursor.fetchall()
        mydb.close()
        return result
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Error: {err}")

# Obtener un usuario por ID
@app.get("/users/{handle}", response_model=User)
def get_user(handle: str):
    try:
        mydb = mysql.connector.connect(
            host=host_name,
            port=port_number,
            user=user_name,
            password=password_db,
            database=database_name
        )
        cursor = mydb.cursor(dictionary=True)
        cursor.execute("SELECT * FROM user WHERE handle = %s", (handle,))
        result = cursor.fetchone()
        mydb.close()
        if result:
            return result
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Error: {err}")

# Añadir un nuevo usuario
@app.post("/users", response_model=Dict[str, Any])
def add_user(user: User):
    try:
        mydb = mysql.connector.connect(
            host=host_name,
            port=port_number,
            user=user_name,
            password=password_db,
            database=database_name
        )
        cursor = mydb.cursor()
        sql = "INSERT INTO user (handle, email, `rank`, rating) VALUES (%s, %s, %s, %s)"
        val = (user.handle, user.email, user.rank, user.rating)
        cursor.execute(sql, val)
        mydb.commit()
        mydb.close()
        return {"message": "User added successfully"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Error: {err}")

@app.put("/users/{handle}")
def update_employee(handle:str, item:User):        
        conn = mysql.connector.connect(
            host=host_name,
            port=port_number,
            user=user_name,
            password=password_db,
            database=database_name
        )
        cursor = conn.cursor()
        sql = """
            UPDATE user set email=%s, `rank`=%s, rating=%s  where handle=%s """
        val = (
             item.email, item.rank, item.rating, item.handle,
        )
        cursor.execute(sql, val)
        conn.commit()
        conn.close()
        return {"message": "User modified successfully"}

@app.delete("/users/{handle}")
def delete_employee(handle: str):
        conn = mysql.connector.connect(
            host=host_name,
            port=port_number,
            user=user_name,
            password=password_db,
            database=database_name
        )
        cursor = conn.cursor()
        cursor.execute(f"DELETE FROM user WHERE handle = '{handle}'")
        conn.commit()
        conn.close()
        return {"message": "User deleted successfully"}
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")

