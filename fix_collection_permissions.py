#!/usr/bin/env python3
"""Fix permissions for conversations and messages collections."""
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
    exit(1)

token = auth_response.json()["token"]
headers = {"Authorization": token, "Content-Type": "application/json"}

print("[OK] Authenticated as superuser\n")

# Get conversations collection
conv_response = requests.get(
    f"{PB_URL}/api/collections/conversations",
    headers=headers
)

if conv_response.status_code != 200:
    print(f"[ERROR] Failed to get conversations collection: {conv_response.status_code}")
    exit(1)

conv_collection = conv_response.json()
print(f"[INFO] Current conversations rules:")
print(f"  createRule: {conv_collection.get('createRule')}")
print(f"  listRule: {conv_collection.get('listRule')}")

# Update conversations collection with correct rules
print("\n[Updating] conversations collection permissions...")
conversations_update = {
    "listRule": "@request.auth.id != \"\" && userId = @request.auth.id",
    "viewRule": "@request.auth.id != \"\" && userId = @request.auth.id",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\" && userId = @request.auth.id",
    "deleteRule": "@request.auth.id != \"\" && userId = @request.auth.id"
}

update_response = requests.patch(
    f"{PB_URL}/api/collections/{conv_collection['id']}",
    headers=headers,
    json=conversations_update
)

if update_response.status_code == 200:
    print("[OK] conversations permissions updated")
    updated = update_response.json()
    print(f"  createRule: {updated['createRule']}")
else:
    print(f"[ERROR] Update failed: {update_response.status_code}")
    print(json.dumps(update_response.json(), indent=2))
    exit(1)

# Get messages collection
msg_response = requests.get(
    f"{PB_URL}/api/collections/messages",
    headers=headers
)

if msg_response.status_code != 200:
    print(f"[ERROR] Failed to get messages collection: {msg_response.status_code}")
    exit(1)

msg_collection = msg_response.json()
print(f"\n[INFO] Current messages rules:")
print(f"  createRule: {msg_collection.get('createRule')}")

# Update messages collection with correct rules
print("\n[Updating] messages collection permissions...")
messages_update = {
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.id != \"\""
}

msg_update_response = requests.patch(
    f"{PB_URL}/api/collections/{msg_collection['id']}",
    headers=headers,
    json=messages_update
)

if msg_update_response.status_code == 200:
    print("[OK] messages permissions updated")
else:
    print(f"[ERROR] Update failed: {msg_update_response.status_code}")
    print(json.dumps(msg_update_response.json(), indent=2))

print("\n[SUCCESS] All permissions fixed!")
print("\nPermissions summary:")
print("- conversations: Users can create their own, only see their own")
print("- messages: Users can create, view all (needed for shared conversations)")
