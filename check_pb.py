#!/usr/bin/env python3
"""Quick script to check PocketBase collections."""
import requests
import json

PB_URL = "https://pocketbase-production-1bcc.up.railway.app"
ADMIN_EMAIL = "sjoerd@twofeetup.com"
ADMIN_PASSWORD = "F5e2kcZ1oYOYVGHY"

# Authenticate as superuser
auth_response = requests.post(
    f"{PB_URL}/api/collections/_superusers/auth-with-password",
    json={"identity": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
)

if auth_response.status_code == 200:
    token = auth_response.json()["token"]
    print(f"[OK] Authenticated successfully")

    # Get collections
    collections_response = requests.get(
        f"{PB_URL}/api/collections",
        headers={"Authorization": token}
    )

    if collections_response.status_code == 200:
        data = collections_response.json()
        print(f"\n[OK] Collections response:")
        print(json.dumps(data, indent=2))
    else:
        print(f"[ERROR] Failed to get collections: {collections_response.status_code}")
        print(collections_response.text)
else:
    print(f"[ERROR] Authentication failed: {auth_response.status_code}")
    print(auth_response.text)
