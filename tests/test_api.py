import requests
from unittest.mock import patch

API_URL = "http://127.0.0.1:8000/api/tasks/"

def test_fetch_tasks(mocker):
    mock_response = [
        {"id": 1, "name": "task 1", "is_completed": True, "project": 1},
        {"id": 2, "name": "task 2", "is_completed": False, "project": 1}
    ]
    mocker.patch('requests.get', return_value=mock_response)

    response = requests.get(API_URL)
    assert response == mock_response

def test_add_task(mocker):
    new_task = {"name": "New Task", "is_completed": False, "project": 1}
    mocker.patch('requests.post', return_value={"id": 1, **new_task})

    response = requests.post(API_URL, json=new_task)
    assert response['name'] == "New Task"
    assert response['is_completed'] is False

def test_update_task(mocker):
    updated_task = {"id": 1, "name": "Updated Task", "is_completed": True}
    mocker.patch('requests.put', return_value=updated_task)

    response = requests.put(f"{API_URL}1/", json=updated_task)
    assert response['name'] == "Updated Task"
    assert response['is_completed'] is True

def test_delete_task(mocker):
    mocker.patch('requests.delete', return_value={})

    response = requests.delete(f"{API_URL}1/")
    assert response == {}
