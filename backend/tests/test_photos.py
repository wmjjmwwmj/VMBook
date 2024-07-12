import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
import json
import requests

SERVER_URL = "http://localhost:8000"


def test_create_user_photo():
    """
    Test case for creating a photo via POST request.
    """
    user_id = "123e4567-e89b-12d3-a456-426614174000"
    image_path = os.path.join(os.path.dirname(__file__), "testimage.jpg")
    test_photo = {
        "image": open(image_path, "rb"),
        "device_id": "123e4567-e89b-12d3-a456-426614174000",
        "location": "Test Location",
        "file_name": "testimage.jpg",
        "file_size": 1024,
        "file_type": "image/jpg"
    }

    # Make POST request to create photo
    response = requests.post(f"{SERVER_URL}/users/{user_id}/photos", json=test_photo)
    
    assert response.status_code == 200
    assert response.json()["file_name"] == test_photo["file_name"]
    assert response.json()["location"] == test_photo["location"]