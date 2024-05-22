from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from typing import List, Dict, Any

app = FastAPI(title="Atcoder")

# Configuración de CORS para permitir todos los orígenes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos HTTP
    allow_headers=["*"],  # Permitir todos los encabezados
)

# Configuración de la base de datos
host_name = "db.ckclbmy02ks1.us-east-1.rds.amazonaws.com"
port_number = "3306"
user_name = "root"
password_db = "utecutec"
database_name = "atcoder"

# Definición del esquema User
class User(BaseModel):
    handle: str
    email: str
    rank: int
    rating: int

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


# Health Check
@app.get("/")
def get_success():
    return {"message": "success"}

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

@app.get("/users/{handle}/submissions")
def get_user(handle: str):
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM submissions WHERE user_handle = '{handle}'")
    result = cursor.fetchall()
    conn.close()
    return {"submissions": result}

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

# ==================
# |  /submissions  |
# ==================

@app.get("/submissions")
def get_submissions():
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM submissions")
    result = cursor.fetchall()
    conn.close()
    return {"submissions": result}

@app.get("/submissions/{id}")
def get_submission(id: int):
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM submissions WHERE id = '{id}'")
    result = cursor.fetchone()
    conn.close()
    return {"submission": result}

@app.post("/submissions")
def add_submission(submission: schemas.SubmissionCreate):
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    sql = """
            INSERT INTO submissions (
                `status`, problem, problem_url, user_handle) VALUES (%s, %s, %s, %s, %s)
        """
    val = tuple(vars(submission).values)
    cursor.execute(sql, val)
    conn.commit()
    conn.close()
    return {"message": "Submission added successfully"}

@app.put("/submissions/{id}")
def update_submission(id:int, submission: schemas.Submission):
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    sql = """
            UPDATE submissions SET `status`=%s, problem=%s, problem_url=%s, user_handle=%s where id=%s
        """
    val = tuple(vars(submission).values) + (id)
    cursor.execute(sql, val)
    conn.commit()
    conn.close()
    return {"message": "Submission modified successfully"}

@app.delete("/submissions/{id}")
def delete_submission(id: int):
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    cursor.execute(f"DELETE FROM submissions WHERE id = '{id}'")
    conn.commit()
    conn.close()
    return {"message": "Submission deleted successfully"}