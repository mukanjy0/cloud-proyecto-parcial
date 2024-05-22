from fastapi import FastAPI
import mysql.connector
import schemas
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Topcoder")

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

host_name = 'db.ckclbmy02ks1.us-east-1.rds.amazonaws.com'  
port_number = '3306'
user_name = 'root'
password_db = 'utecutec'
database_name = 'topcoder'


# Health Check
@app.get("/")
def get_success():
    return {"message": "success"}

# GET USERS
@app.get('/users')
def get_topcoder_users():
    mydb = mysql.connector.connect(host = host_name, port = port_number, user = user_name, password = password_db, database = database_name)
    cursor = mydb.cursor()
    cursor.execute('SELECT * FROM user')
    result = cursor.fetchall()
    mydb.close()
    return {"users": result}
    
# GET USER BY ID
@app.get('/users/{handle}')
def get_topcoder_users(handle: str):
    mydb = mysql.connector.connect(host = host_name, port = port_number, user = user_name, password = password_db, database = database_name)
    cursor = mydb.cursor()
    cursor.execute(f"SELECT * FROM user WHERE handle = '{handle}'")
    result = cursor.fetchone()
    mydb.close()
    return {"users": result}

@app.get("/users/{handle}/submissions")
def get_user(handle: str):
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM submissions WHERE user_handle = '{handle}'")
    result = cursor.fetchall()
    conn.close()
    return {"submissions": result}

# POST USER
@app.post("/users")
def add_topcoder_users(item:schemas.Item):
    mydb = mysql.connector.connect(host=host_name, port=port_number, user=user_name, password=password_db, database=database_name)  
    handle = item.handle
    firstName = item.firstName
    lastName = item.lastName
    city = item.city
    email = item.email
    cursor = mydb.cursor()
    sql = "INSERT INTO user (handle, firstName, lastName, city, email) VALUES (%s, %s, %s, %s, %s)"
    val = (handle, firstName, lastName, city, email)
    cursor.execute(sql, val)
    mydb.commit()
    mydb.close()
    return {"message": "User added successfully"}

# Modify an USER
@app.put("/users/{handle}")
def update_topcoder_users(handle:str, item:schemas.Item):
    mydb = mysql.connector.connect(host=host_name, port=port_number, user=user_name, password=password_db, database=database_name)  
    firstName = item.firstName
    lastName = item.lastName
    city = item.city
    email = item.email
    cursor = mydb.cursor()
    sql = "UPDATE user set firstName=%s, lastName=%s, city=%s, email=%s where handle=%s"
    val = (firstName, lastName, city, email, handle)
    cursor.execute(sql, val)
    mydb.commit()
    mydb.close()
    return {"message": "User modified successfully"}

# Delete an employee by ID
@app.delete("/users/{handle}")
def delete_topcoder_users(handle: str):
    mydb = mysql.connector.connect(host=host_name, port=port_number, user=user_name, password=password_db, database=database_name)  
    cursor = mydb.cursor()
    cursor.execute(f"DELETE FROM user WHERE handle = '{handle}'")
    mydb.commit()
    mydb.close()
    return {"message": "User deleted successfully"}

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