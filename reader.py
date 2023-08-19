import requests
import subprocess


# Replace with your own OpenWeatherMap API key
api_key = "35701ad524635b065706933439a9ab30"

# Specify the coordinates (latitude and longitude)
latitude = 40.2282222197361  # Example latitude (New York City)
longitude = -111.643483400395  # Example longitude (New York City)
# API endpoint URL
# url = f"http://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={api_key}&units=imperial"
url = f"https://api.openweathermap.org/data/3.0/onecall?lat={latitude}&lon={longitude}&appid={api_key}&units=imperial"

print(url)

# Make the API request
response = requests.get(url)


def text_to_speech(text):
    subprocess.call(["espeak", text])


# Check if the request was successful
if response.status_code == 200:
    weather_data = response.json()

    # Extract relevant weather information
    temperature = weather_data["current"]["temp"]
    weather_description = weather_data["current"]["weather"][0]["description"]

    print(f"Temperature: {temperature} K")
    print(f"Weather: {weather_description}")
    text_to_speech(
        f"Weather for Provo, Utah: {weather_description} and {temperature} degrees Fahrenheit")
else:
    print("Error fetching weather data")
