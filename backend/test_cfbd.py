import os
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("CFBD_API_KEY")

headers = {"Authorization": f"Bearer {api_key}"}
url = "https://api.collegefootballdata.com/games"
params = {"year": 2024}

response = requests.get(url, headers=headers, params=params)
print("Status:", response.status_code)
print("Number of games:", len(response.json()) if response.status_code == 200 else "Error")
if response.status_code == 200 and response.json():
    print("First game keys:", list(response.json()[0].keys())[:10])
    print("First game:", response.json()[0])
    