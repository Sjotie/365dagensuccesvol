#!/usr/bin/env python3
"""Create a test user in PocketBase."""
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

if auth_response.status_code != 200:
    print(f"[ERROR] Authentication failed: {auth_response.status_code}")
    print(auth_response.text)
    exit(1)

token = auth_response.json()["token"]
headers = {"Authorization": token, "Content-Type": "application/json"}

print("[OK] Authenticated successfully\n")

# Create test user
user_data = {
    "email": "test@twofeetup.com",
    "password": "testpassword123",
    "passwordConfirm": "testpassword123",
    "name": "Test User",
    "emailVisibility": True,
    "verified": True
}

print("[Creating] Test user...")
create_response = requests.post(
    f"{PB_URL}/api/collections/users/records",
    headers=headers,
    json=user_data
)

if create_response.status_code in [200, 201]:
    user = create_response.json()
    print("[OK] User created successfully!\n")
    print("=" * 60)
    print("USER CREDENTIALS")
    print("=" * 60)
    print(f"Email:    {user_data['email']}")
    print(f"Password: {user_data['password']}")
    print(f"Name:     {user_data['name']}")
    print(f"ID:       {user['id']}")
    print("=" * 60)
    print("\nYou can now login at: http://localhost:3000")
elif create_response.status_code == 400:
    error_data = create_response.json()
    if "email" in error_data.get("data", {}):
        print("[INFO] User already exists!")
        print("\n" + "=" * 60)
        print("EXISTING USER CREDENTIALS")
        print("=" * 60)
        print(f"Email:    {user_data['email']}")
        print(f"Password: {user_data['password']}")
        print("=" * 60)
    else:
        print(f"[ERROR] Failed to create user: {create_response.status_code}")
        print(json.dumps(error_data, indent=2))
else:
    print(f"[ERROR] Failed to create user: {create_response.status_code}")
    print(create_response.text)
