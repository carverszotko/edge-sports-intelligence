import os
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("THERUNDOWN_API_KEY")

print("Key found:", bool(api_key))

headers = {"X-TheRundown-Key": api_key}

# First, check available sports
print("\nChecking sports...")
response = requests.get("https://therundown.io/api/v2/sports", headers=headers)
print("Sports status:", response.status_code)
if response.status_code == 200:
    sports = response.json()
    for s in sports.get("sports", [])[:5]:
        print(f"  {s.get('sport_id')}: {s.get('sport_name')}")

# Try a recent date
print("\nTrying odds for 2024-09-07...")
url = "https://therundown.io/api/v2/sports/1/events/2024-09-07"
params = {"market_ids": "1,2,3"}
response = requests.get(url, headers=headers, params=params)
print("Odds status:", response.status_code)
print("Response:", response.text[:500] if response.text else "Empty")
