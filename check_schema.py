#!/usr/bin/env python3
"""Check actual schema of conversations collection."""
import requests
import json

PB_URL = "https://pocketbase-production-1bcc.up.railway.app"
ADMIN_EMAIL = "sjoerd@twofeetup.com"
ADMIN_PASSWORD = "F5e2kcZ1oYOYVGHY"

auth_response = requests.post(
    f"{PB_URL}/api/collections/_superusers/auth-with-password",
    json={"identity": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
)

token = auth_response.json()["token"]
headers = {"Authorization": token}

# Get conversations collection schema
conv_response = requests.get(
    f"{PB_URL}/api/collections/conversations",
    headers=headers
)

if conv_response.status_code == 200:
    conv = conv_response.json()
    print("CONVERSATIONS COLLECTION SCHEMA:")
    print("=" * 60)
    print(f"ID: {conv['id']}")
    print(f"Name: {conv['name']}")
    print(f"Type: {conv['type']}")
    print(f"\nFields:")
    for field in conv.get('schema', []):
        print(f"  - {field['name']} ({field['type']}) - required: {field.get('required', False)}")
    print(f"\nRules:")
    print(f"  createRule: {conv.get('createRule')}")
    print(f"  listRule: {conv.get('listRule')}")
else:
    print(f"Error: {conv_response.status_code}")
    print(conv_response.text)
