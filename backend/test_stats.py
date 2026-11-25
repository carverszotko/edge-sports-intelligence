import os
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("CFBD_API_KEY")
headers = {"Authorization": f"Bearer {api_key}"}

url = "https://api.collegefootballdata.com/stats/season"
params = {"year": 2024, "team": "Alabama"}

response = requests.get(url, headers=headers, params=params)
stats = response.json()

print("All stat names:")
for s in stats:
    print(f"  {s.get('statName')}")
    