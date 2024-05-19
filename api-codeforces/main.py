from fastapi import FastAPI
import mysql.connector
import schemas

app = FastAPI()

config = {
    'host': 'host', # must change
    'port': '8005',
    'user': 'root',
    'password': 'utec',
    'database': 'codeforces'
}


@app.get("/users")
def get_employees():
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    result = cursor.fetchall()
    conn.close()
    return {"users": result}

@app.get("/users/{handle}")
def get_employee(handle: str):
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM users WHERE handle = {handle}")
    result = cursor.fetchone()
    conn.close()
    return {"user": result}

@app.post("/users")
def add_user(item:schemas.User):
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    sql = """
            INSERT INTO users (
                handle, email, firstName, lastName, country, city, organization, contribution,
                rank, rating, maxRank, maxRating, registrationTimeSeconds, avatar, titlePhoto
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
    val = (
            user.handle, user.email, user.firstName, user.lastName, user.country, user.city,
            user.organization, user.contribution, user.rank, user.rating, user.maxRank, user.maxRating,
            user.registrationTimeSeconds, user.avatar, user.titlePhoto
        )
    cursor.execute(sql, val)
    conn.commit()
    conn.close()
    return {"message": "User added successfully"}

@app.put("/users/{handle}")
def update_employee(handle:str, item:schemas.User):
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    sql = """
            UPDATE users set handle=%s, email=%s, firstName=%s, lastName=%s, country=%s, city=%s, organization=%s, contribution=%s,
                rank=%s, rating=%s, maxRank=%s, maxRating=%s, registrationTimeSeconds=%s, avatar=%s, titlePhoto=%s
                where handle=%s
        """
    val = (
            user.handle, user.email, user.firstName, user.lastName, user.country, user.city,
            user.organization, user.contribution, user.rank, user.rating, user.maxRank, user.maxRating,
            user.registrationTimeSeconds, user.avatar, user.titlePhoto
        )
    cursor.execute(sql, val)
    conn.commit()
    conn.close()
    return {"message": "User modified successfully"}

@app.delete("/users/{handle}")
def delete_employee(handle: str):
    conn = mysql.connector.connect(**config)  
    cursor = conn.cursor()
    cursor.execute(f"DELETE FROM users WHERE handle = {handle}")
    conn.commit()
    conn.close()
    return {"message": "User deleted successfully"}