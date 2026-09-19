import requests
import json
from datetime import date

# --- Configuration ---
TOKEN_URL = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
SEARCH_URL = "https://catalogue.dataspace.copernicus.eu/resto/api/collections/Sentinel2/search.json"

# Define your region of interest (lon/lat)
GEOMETRY_WKT = "POLYGON((82.9 25.2, 83.0 25.2, 83.0 25.3, 82.9 25.3, 82.9 25.2))"

SEARCH_START_DATE = "2023-01-01T00:00:00Z"
SEARCH_END_DATE = "2024-01-01T00:00:00Z"
MAX_CLOUD_COVER = 10
RESULTS_LIMIT = 10


def get_access_token(username, password):
    """Authenticate with Copernicus Data Space and return access token."""
    data = {
        "client_id": "cdse-public",
        "grant_type": "password",
        "username": username,
        "password": password,
    }

    response = requests.post(TOKEN_URL, data=data)
    response.raise_for_status()
    return response.json().get("access_token")


def search_sentinel_data(token):
    """Query Sentinel-2 data for given region, date range, and filters."""
    headers = {"Authorization": f"Bearer {token}"}

    # ✅ Removed invalid 'q' parameter
    params = {
        "startDate": SEARCH_START_DATE,
        "completionDate": SEARCH_END_DATE,
        "cloudCover": f"[0,{MAX_CLOUD_COVER}]",
        "geometry": GEOMETRY_WKT,
        "maxRecords": RESULTS_LIMIT,
    }

    response = requests.get(SEARCH_URL, headers=headers, params=params)
    response.raise_for_status()

    data = response.json()
    features = data.get("features", [])

    if not features:
        print("❌ No Sentinel-2 images found for this region/date range.")
        return

    print(f"✅ Found {len(features)} Sentinel-2 scenes:\n")
    for i, feature in enumerate(features[:RESULTS_LIMIT]):
        props = feature.get("properties", {})
        print(
            f"{i+1}. Title: {props.get('title', 'N/A')}\n"
            f"   Cloud Cover: {props.get('cloudCover', 'N/A')}%\n"
            f"   Acquisition Date: {props.get('startDate', 'N/A')}\n"
            f"   Product ID: {props.get('productIdentifier', 'N/A')}\n"
        )


if __name__ == "__main__":
    print("🌍 Sentinel-2 Data Search Tool\n")
    username = input("Enter CDSE Username (Email): ")
    password = input("Enter CDSE Password: ")

    print("\n🔑 Getting authentication token...")
    try:
        token = get_access_token(username, password)
        print("✅ Token acquired successfully!")

        print("\n🔍 Searching Sentinel-2 scenes...")
        search_sentinel_data(token)

    except requests.exceptions.HTTPError as e:
        print(f"❌ HTTP ERROR: {e}")
        print(f"Response: {e.response.text}")
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
