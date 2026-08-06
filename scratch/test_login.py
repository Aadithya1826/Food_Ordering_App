import requests

# Assuming admin login
url = "http://localhost:8000/api/v1/auth/login"
data = {
    "username": "aadithya1826@gmail.com",
    "password": "password" # just guessing, or I can bypass if I check the db
}
# wait, maybe I can just do a GET without token to see if it is 401
