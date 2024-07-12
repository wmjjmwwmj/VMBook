import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import pytest
import json
import requests
import string
import random

SERVER_URL = "http://localhost:8000"

def random_string(length=10):
    """Generate a random string of fixed length"""
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

@pytest.fixture(scope="function")
def create_test_user():
    """
    Create a test user
    """
    test_user = {
        "username": f"testuser_{random_string()}",
        "email": f"{random_string()}@test.com",
        "password": "password123"
    }
    
    response = requests.post(f"{SERVER_URL}/users", json=test_user, headers={"Content-Type": "application/json"})
    user_data = response.json()
    yield user_data
    
    # Clean up: Delete the user after the test
    requests.delete(f"{SERVER_URL}/users/{user_data['user_id']}")

@pytest.fixture(scope="function")
def create_test_device(create_test_user):
    """
    Create a test device
    """
    test_user = create_test_user
    test_device = {
        "device_name": f"testdevice_{random_string()}",
        "device_type": "Arduino",
        "os_version": "14.0",
        "app_version": "1.0",
        "api_key": f"{random_string()}"
    }
    
    response = requests.post(f"{SERVER_URL}/users/{test_user['user_id']}/devices", json=test_device, headers={"Content-Type": "application/json"})
    device_data = response.json()
    
    yield device_data
    
    # Clean up: Delete the device after the test
    requests.delete(f"{SERVER_URL}/devices/{device_data['device_id']}")

def test_create_photo(create_test_device):
    """
    Test case for creating a photo via POST request
    """
    device = create_test_device
    print("Device:", device)
    

    filepath = os.path.join(os.path.dirname(__file__), "testimage.jpg")
    with open(filepath, "rb") as image_file:
        files = {"image": ("testimage.jpg", open(filepath, "rb"), "image/jpeg")}
        photo_create = {
            "device_id": device["device_id"],
            "location": "Test Location",
            "file_name": "testimage.jpg",
            "file_size": 1024,
            "file_type": "jpg"
            }
        data = {
            "photo_create": json.dumps(photo_create)
        }
        response = requests.post(f"{SERVER_URL}/users/{device['user_id']}/photos", files=files, data=data)
        
    print("Response:", response.text)
    
    assert response.status_code == 200
    
    photo_data = response.json()
    assert photo_data["photo_id"]
    assert "url" in photo_data  # Changed from photo_url to url
    assert photo_data["device_id"] == photo_create["device_id"]
    
    # Clean up: Delete the photo after the test
    requests.delete(f"{SERVER_URL}/photos/{photo_data['photo_id']}")