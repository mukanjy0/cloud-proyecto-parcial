import requests

def get_top_users():
    url = "https://codeforces.com/api/user.ratedList?activeOnly=true&includeRetired=false"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data["result"][:20]  # Extracting top 20 users
    else:
        print("Failed to fetch data from Codeforces API")
        return None

def generate_insert_statements(users):
    inserts = []
    for user in users:
        handle = user["handle"]
        email = handle + "@protonmail.com"
        first_name = user.get("firstName", "")
        last_name = user.get("lastName", "")
        country = user.get("country", "")
        city = user.get("city", "")
        rank = user["maxRank"]
        rating = user["maxRating"]
        
        insert = f"('{handle}', '{email}', '{first_name}', '{last_name}', '{country}', '{city}', '{rank}', {rating})"
        inserts.append(insert)
    
    return inserts

# Fetch top users
users = get_top_users()

# Generate insert statements
if users:
    insert_statements = generate_insert_statements(users)
    with open("populate-codeforces.sql","w") as file:
      file.write("INSERT INTO users (handle, email, firstName, lastName, country, city, `rank`, rating) VALUES\n")
      for insert in insert_statements[0:-1]:
          file.write(insert+",\n")
      file.write(insert_statements[-1]+";\n")
