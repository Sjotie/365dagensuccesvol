#!/usr/bin/env python3
"""Import collections using PocketBase import API."""
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
headers = {"Authorization": token, "Content-Type": "application/json"}

print("[OK] Authenticated\n")

# Load schema
with open('conversations_schema.json', 'r') as f:
    collections = json.load(f)

print(f"[INFO] Loaded {len(collections)} collections from schema\n")

# Delete existing
print("[Deleting] Existing collections...")
for coll_name in ['conversations', 'messages']:
    del_response = requests.delete(
        f"{PB_URL}/api/collections/{coll_name}",
        headers=headers
    )
    print(f"  {coll_name}: {del_response.status_code}")

# Import using sync endpoint
print("\n[Importing] Collections via sync endpoint...")
import_data = {
    "collections": collections,
    "deleteMissing": False
}

sync_response = requests.put(
    f"{PB_URL}/api/collections/import",
    headers=headers,
    json=import_data
)

if sync_response.status_code in [200, 204]:
    print("[OK] Collections imported successfully!")
else:
    print(f"[ERROR] Import failed: {sync_response.status_code}")
    print(json.dumps(sync_response.json(), indent=2))

# Verify
print("\n[Verifying] conversations collection...")
verify_response = requests.get(
    f"{PB_URL}/api/collections/conversations",
    headers=headers
)

if verify_response.status_code == 200:
    conv = verify_response.json()
    print(f"[OK] conversations collection verified")
    print(f"  Fields: {len(conv.get('fields', []))}")
    print(f"  createRule: {conv.get('createRule')}")
    for field in conv.get('fields', []):
        if not field.get('system'):
            print(f"    - {field['name']} ({field['type']})")
else:
    print(f"[ERROR] Verification failed: {verify_response.status_code}")
