#!/usr/bin/env python3
"""Delete and recreate conversations/messages collections with proper schema."""
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

# Delete existing collections
print("[Deleting] Old conversations collection...")
del_conv = requests.delete(
    f"{PB_URL}/api/collections/conversations",
    headers=headers
)
print(f"[INFO] Delete conversations: {del_conv.status_code}")

print("[Deleting] Old messages collection...")
del_msg = requests.delete(
    f"{PB_URL}/api/collections/messages",
    headers=headers
)
print(f"[INFO] Delete messages: {del_msg.status_code}")

# Create conversations collection with proper schema
print("\n[Creating] conversations collection with full schema...")
conversations_schema = {
    "name": "conversations",
    "type": "base",
    "schema": [
        {
            "name": "title",
            "type": "text",
            "required": False,
            "options": {}
        },
        {
            "name": "userId",
            "type": "relation",
            "required": True,
            "options": {
                "collectionId": "_pb_users_auth_",
                "cascadeDelete": False,
                "minSelect": None,
                "maxSelect": 1,
                "displayFields": []
            }
        },
        {
            "name": "assistantType",
            "type": "text",
            "required": False,
            "options": {}
        },
        {
            "name": "lastMessage",
            "type": "text",
            "required": False,
            "options": {}
        },
        {
            "name": "isActive",
            "type": "bool",
            "required": False,
            "options": {}
        }
    ]
}

conv_response = requests.post(
    f"{PB_URL}/api/collections",
    headers=headers,
    json=conversations_schema
)

if conv_response.status_code in [200, 201]:
    conv = conv_response.json()
    conversations_id = conv['id']
    print(f"[OK] conversations created with ID: {conversations_id}")

    # Now update with rules
    print("[Updating] conversations rules...")
    rules = {
        "listRule": "@request.auth.id != \"\" && userId = @request.auth.id",
        "viewRule": "@request.auth.id != \"\" && userId = @request.auth.id",
        "createRule": "@request.auth.id != \"\"",
        "updateRule": "@request.auth.id != \"\" && userId = @request.auth.id",
        "deleteRule": "@request.auth.id != \"\" && userId = @request.auth.id"
    }

    update_response = requests.patch(
        f"{PB_URL}/api/collections/{conversations_id}",
        headers=headers,
        json=rules
    )

    if update_response.status_code == 200:
        print("[OK] conversations rules applied")
    else:
        print(f"[WARN] Rules update failed: {update_response.status_code}")
        print(json.dumps(update_response.json(), indent=2))
else:
    print(f"[ERROR] conversations creation failed: {conv_response.status_code}")
    print(json.dumps(conv_response.json(), indent=2))
    exit(1)

# Create messages collection
print("\n[Creating] messages collection with full schema...")
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
                "cascadeDelete": False,
                "minSelect": None,
                "maxSelect": 1,
                "displayFields": []
            }
        },
        {
            "name": "role",
            "type": "text",
            "required": True,
            "options": {}
        },
        {
            "name": "content",
            "type": "editor",
            "required": True,
            "options": {}
        },
        {
            "name": "userId",
            "type": "relation",
            "required": True,
            "options": {
                "collectionId": "_pb_users_auth_",
                "cascadeDelete": False,
                "minSelect": None,
                "maxSelect": 1,
                "displayFields": []
            }
        }
    ]
}

msg_response = requests.post(
    f"{PB_URL}/api/collections",
    headers=headers,
    json=messages_schema
)

if msg_response.status_code in [200, 201]:
    msg = msg_response.json()
    messages_id = msg['id']
    print(f"[OK] messages created with ID: {messages_id}")

    # Update with rules
    print("[Updating] messages rules...")
    rules = {
        "listRule": "@request.auth.id != \"\"",
        "viewRule": "@request.auth.id != \"\"",
        "createRule": "@request.auth.id != \"\"",
        "updateRule": "@request.auth.id != \"\"",
        "deleteRule": "@request.auth.id != \"\""
    }

    update_response = requests.patch(
        f"{PB_URL}/api/collections/{messages_id}",
        headers=headers,
        json=rules
    )

    if update_response.status_code == 200:
        print("[OK] messages rules applied")
    else:
        print(f"[WARN] Rules update failed: {update_response.status_code}")
else:
    print(f"[ERROR] messages creation failed: {msg_response.status_code}")
    print(json.dumps(msg_response.json(), indent=2))
    exit(1)

print("\n[SUCCESS] Collections recreated with proper schema and permissions!")
