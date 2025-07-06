import requests

# Define the backend API URL
url = "http://localhost:5000/api/simulate"

# Define simulation parameters
payload = {
    "alpha": 0.1,
    "gamma": 0.95,
    "epsilon": 0.2,
    "episodes": 10
}

# Send POST request
response = requests.post(url, json=payload)

# Show response
print("Status Code:", response.status_code)
print("Response JSON:")
print(response.json())
