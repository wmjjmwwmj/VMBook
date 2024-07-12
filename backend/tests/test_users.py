import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
import json
import requests

SERVER_URL = "http://localhost:8000"

def test_create_user():
    """
    Test case for creating a user via POST request.
    """
    # Test data
    test_user = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    }

    # Make POST request to create user
    response = requests.post(f"{SERVER_URL}/users", json=test_user)
    print(response.json())
    
    assert response.status_code == 200
    assert response.json()["username"] == test_user["username"]
    assert response.json()["email"] == test_user["email"]


    
def test_get_users():
    """
    Test case for getting all users via GET request.
    """
    # Make GET request to get all users
    response = requests.get(f"{SERVER_URL}/users")
    print(response.json())
    
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0
    assert "username" in response.json()[0]
    assert "email" in response.json()[0]
    
