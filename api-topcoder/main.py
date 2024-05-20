from fastapi import FastAPI
import mysql.connector
import schemas
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

host_name = '3.221.35.104'  
port_number = '8005'
user_name = 'root'
password_db = 'utec'
database_name = 'bd_api_topcoder_users'


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
    cursor.execute(f"SELECT * FROM user WHERE id = '{handle}'")
    result = cursor.fetchone()
    mydb.close()
    return {"users": result}

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
@app.put("/users/{id}")
def update_topcoder_users(id:int, item:schemas.Item):
    mydb = mysql.connector.connect(host=host_name, port=port_number, user=user_name, password=password_db, database=database_name)  
    handle = item.handle
    firstName = item.firstName
    lastName = item.lastName
    city = item.city
    email = item.email
    cursor = mydb.cursor()
    sql = "UPDATE user set name=%s, apellidos=%s, ciudad=%s, correo=%s , tc_name=%s  where id=%s"
    val = (handle, firstName, lastName, city, email, id)
    cursor.execute(sql, val)
    mydb.commit()
    mydb.close()
    return {"message": "User modified successfully"}

# Delete an employee by ID
@app.delete("/users/{id}")
def delete_topcoder_users(id: int):
    mydb = mysql.connector.connect(host=host_name, port=port_number, user=user_name, password=password_db, database=database_name)  
    cursor = mydb.cursor()
    cursor.execute(f"DELETE FROM user WHERE id = {id}")
    mydb.commit()
    mydb.close()
    return {"message": "User deleted successfully"}