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
@app.get('/topcoder_users')
def get_topcoder_users():
    mydb = mysql.connector.connect(host = host_name, port = port_number, user = user_name, password = password_db, database = database_name)
    cursor = mydb.cursor()
    cursor.execute('SELECT * FROM topcoder_users')
    result = cursor.fetchall()
    mydb.close()
    return {"users": result}
    
# GET USER BY ID
@app.get('/topcoder_users/{id}')
def get_topcoder_users(id: int):
    mydb = mysql.connector.connect(host = host_name, port = port_number, user = user_name, password = password_db, database = database_name)
    cursor = mydb.cursor()
    cursor.execute(f'SELECT * FROM topcoder_users WHERE id = {id}')
    result = cursor.fetchone()
    mydb.close()
    return {"users": result}

# POST USER
@app.post("/topcoder_users")
def add_topcoder_users(item:schemas.Item):
    mydb = mysql.connector.connect(host=host_name, port=port_number, user=user_name, password=password_db, database=database_name)  
    name = item.name
    apellidos = item.apellidos
    ciudad = item.ciudad
    correo = item.correo
    tc_name = item.tc_name
    cursor = mydb.cursor()
    sql = "INSERT INTO topcoder_users (name, apellidos, ciudad, correo, tc_name) VALUES (%s, %s, %s, %s, %s)"
    val = (name, apellidos, ciudad, correo, tc_name)
    cursor.execute(sql, val)
    mydb.commit()
    mydb.close()
    return {"message": "User added successfully"}

# Modify an USER
@app.put("/topcoder_users/{id}")
def update_topcoder_users(id:int, item:schemas.Item):
    mydb = mysql.connector.connect(host=host_name, port=port_number, user=user_name, password=password_db, database=database_name)  
    name = item.name
    apellidos = item.apellidos
    ciudad = item.ciudad
    correo = item.correo
    tc_name = item.tc_name
    cursor = mydb.cursor()
    sql = "UPDATE topcoder_users set name=%s, apellidos=%s, ciudad=%s, correo=%s , tc_name=%s  where id=%s"
    val = (name, apellidos, ciudad, correo, tc_name, id)
    cursor.execute(sql, val)
    mydb.commit()
    mydb.close()
    return {"message": "User modified successfully"}

# Delete an employee by ID
@app.delete("/topcoder_users/{id}")
def delete_topcoder_users(id: int):
    mydb = mysql.connector.connect(host=host_name, port=port_number, user=user_name, password=password_db, database=database_name)  
    cursor = mydb.cursor()
    cursor.execute(f"DELETE FROM topcoder_users WHERE id = {id}")
    mydb.commit()
    mydb.close()
    return {"message": "User deleted successfully"}