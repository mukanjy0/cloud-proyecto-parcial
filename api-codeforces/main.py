from fastapi import FastAPI, HTTPException
import mysql.connector
import schemas
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Codeforces")

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)


config = {
    
    'host' :'db.ckclbmy02ks1.us-east-1.rds.amazonaws.com',  
    'port' :  '3306',
    'user' : 'root',
    'password' : 'utecutec',
    'database': 'codeforces'
}


# Health Check
@app.get("/")
def get_success():
    return {"message": "success"}

@app.get("/users")
def get_users():
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    result = cursor.fetchall()
    conn.close()
    return {"users": result}

@app.get("/users/{handle}")
def get_user(handle: str):
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM users WHERE handle = '{handle}'")
    result = cursor.fetchone()
    conn.close()
    return {"user": result}

@app.post("/users")
def add_user(item:schemas.User):
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    sql = """
            INSERT INTO users (
                handle, email, firstName, lastName, country, city, `rank`  , rating ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
    val = (
            item.handle, item.email, item.firstName, item.lastName, item.country, item.city, item.rank, item.rating
        )
    cursor.execute(sql, val)
    conn.commit()
    conn.close()
    return {"message": "User added successfully"}

@app.put("/users/{handle}")
def update_user(handle:str, item:schemas.User):
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    sql = """
            UPDATE users set email=%s, firstName=%s, lastName=%s, country=%s, city=%s, `rank`=%s, rating=%s where handle=%s
        """
    val = (item.email, item.firstName, item.lastName, item.country, item.city, item.rank, item.rating, item.handle)
    cursor.execute(sql, val)
    conn.commit()
    conn.close()
    return {"message": "User modified successfully"}

@app.delete("/users/{handle}")
def delete_user(handle: str):
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    cursor.execute(f"DELETE FROM users WHERE handle = '{handle}'")
    conn.commit()
    conn.close()
    return {"message": "User deleted successfully"}

@app.get("/users/{handle}/submissions")
def get_user(handle: str):
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM submission WHERE user_handle = '{handle}'")
    result = cursor.fetchall()
    conn.close()
    return {"submissions": result}


# ==================
# |  /submissions  |
# ==================

@app.get("/submissions")
def get_submissions():
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM submission")
    result = cursor.fetchall()
    conn.close()
    return {"submissions": result}

@app.get("/submissions/{id}")
def get_submission(id: int):
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM submission WHERE id = '{id}'")
    result = cursor.fetchone()
    conn.close()
    return {"submission": result}

@app.post("/submissions")
def add_submission(submission: schemas.SubmissionCreate):
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        sql = """
            INSERT INTO submission (
                `status`, problem, url_problem, user_handle
            ) VALUES (%s, %s, %s, %s)
        """
        val = (submission.status, submission.problem, submission.url_problem, submission.user_handle)
        cursor.execute(sql, val)
        conn.commit()
        conn.close()
        return {"message": "Submission added successfully"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Error: {err}")

@app.put("/submissions/{id}")
def update_submission(id: int, submission: schemas.SubmissionCreate):
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        sql = """
            UPDATE submission SET `status`=%s, problem=%s, url_problem=%s, user_handle=%s WHERE id=%s
        """
        val = (submission.status, submission.problem, submission.url_problem, submission.user_handle, id)
        cursor.execute(sql, val)
        conn.commit()
        conn.close()
        return {"message": "Submission modified successfully"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Error: {err}")

@app.delete("/submissions/{id}")
def delete_submission(id: int):
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    cursor.execute(f"DELETE FROM submission WHERE id = '{id}'")
    conn.commit()
    conn.close()
    return {"message": "Submission deleted successfully"}
