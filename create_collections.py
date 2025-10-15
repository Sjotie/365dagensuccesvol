#!/usr/bin/env python3
"""Create conversations and messages collections in PocketBase."""
import requests
import json

PB_URL = "https://pocketbase-production-1bcc.up.railway.app"
ADMIN_EMAIL = "sjoerd@twofeetup.com"
ADMIN_PASSWORD = "F5e2kcZ1oYOYVGHY"

# Authenticate
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

# Create conversations collection without rules first
conversations_schema = {
    "name": "conversations",
    "type": "base",
    "schema": [
        {
            "name": "title",
            "type": "text",
            "required": False
        },
        {
            "name": "userId",
            "type": "relation",
            "required": True,
            "options": {
                "collectionId": "_pb_users_auth_",
                "cascadeDelete": False
            }
        },
        {
            "name": "assistantType",
            "type": "text",
            "required": False
        },
        {
            "name": "lastMessage",
            "type": "text",
            "required": False
        },
        {
            "name": "isActive",
            "type": "bool",
            "required": False
        }
    ],
    "listRule": None,
    "viewRule": None,
    "createRule": None,
    "updateRule": None,
    "deleteRule": None
}

print("[Creating] conversations collection...")
conv_response = requests.post(
    f"{PB_URL}/api/collections",
    headers=headers,
    json=conversations_schema
)

if conv_response.status_code in [200, 201]:
    print("[OK] conversations collection created")
    conversations_id = conv_response.json()["id"]

    # Update with access rules
    print("[Updating] conversations access rules...")
    rules_update = {
        "listRule": "@request.auth.id != \"\" && userId = @request.auth.id",
        "viewRule": "@request.auth.id != \"\" && userId = @request.auth.id",
        "createRule": "@request.auth.id != \"\" && userId = @request.auth.id",
        "updateRule": "@request.auth.id != \"\" && userId = @request.auth.id",
        "deleteRule": "@request.auth.id != \"\" && userId = @request.auth.id"
    }
    update_response = requests.patch(
        f"{PB_URL}/api/collections/{conversations_id}",
        headers=headers,
        json=rules_update
    )
    if update_response.status_code == 200:
        print("[OK] conversations rules updated")
    else:
        print(f"[WARN] Failed to update rules: {update_response.status_code}")
else:
    print(f"[ERROR] Failed to create conversations: {conv_response.status_code}")
    print(conv_response.text)
    # Try to get existing collection
    get_conv = requests.get(f"{PB_URL}/api/collections/conversations", headers=headers)
    if get_conv.status_code == 200:
        conversations_id = get_conv.json()["id"]
        print(f"[OK] conversations collection already exists with ID: {conversations_id}")
    else:
        exit(1)

# Create messages collection without rules first
messages_schema = {
    "name": "messages",
    "type": "base",
    "schema": [
        {
            "name": "conversationId",
            "type": "relation",
            "required": True,
            "options": {
                "collectionId": conversations_id,
                "cascadeDelete": False
            }
        },
        {
            "name": "role",
            "type": "text",
            "required": True
        },
        {
            "name": "content",
            "type": "editor",
            "required": True
        },
        {
            "name": "userId",
            "type": "relation",
            "required": True,
            "options": {
                "collectionId": "_pb_users_auth_",
                "cascadeDelete": False
            }
        }
    ],
    "listRule": None,
    "viewRule": None,
    "createRule": None,
    "updateRule": None,
    "deleteRule": None
}

print("[Creating] messages collection...")
msg_response = requests.post(
    f"{PB_URL}/api/collections",
    headers=headers,
    json=messages_schema
)

if msg_response.status_code in [200, 201]:
    print("[OK] messages collection created")
    messages_id = msg_response.json()["id"]

    # Update with access rules
    print("[Updating] messages access rules...")
    rules_update = {
        "listRule": "@request.auth.id != \"\"",
        "viewRule": "@request.auth.id != \"\"",
        "createRule": "@request.auth.id != \"\"",
        "updateRule": "@request.auth.id != \"\"",
        "deleteRule": "@request.auth.id != \"\""
    }
    update_response = requests.patch(
        f"{PB_URL}/api/collections/{messages_id}",
        headers=headers,
        json=rules_update
    )
    if update_response.status_code == 200:
        print("[OK] messages rules updated")
    else:
        print(f"[WARN] Failed to update rules: {update_response.status_code}")
elif msg_response.status_code == 400 and "already exists" in msg_response.text:
    print("[OK] messages collection already exists")
else:
    print(f"[ERROR] Failed to create messages: {msg_response.status_code}")
    print(msg_response.text)
    exit(1)

print("\n[SUCCESS] All collections created successfully!")
