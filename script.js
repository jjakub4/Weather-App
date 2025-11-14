// Initialize variables for storing the user's latitude and longitude
let userLatitude;
let userLongitude;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  userLatitude = position.coords.latitude;
  userLongitude = position.coords.longitude;

  console.log("Latitude: " + userLatitude + " Longitude: " + userLongitude);

  getData(userLatitude, userLongitude);
}

// Function to handle location errors (e.g., user denies permission)
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      break;
  }
}

getLocation();

// Function to fetch weather data from Open-Meteo API
async function getData(lat, lon) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m`
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Searchbar section for user input (if needed)
const searchbar = document.getElementById("searchbar");
const searchBtn = document.getElementById("search-btn");

// Handling dropdowns (unit and hourly options)
const unitBtn = document.getElementById("unit-dropdown-btn");
const unitDropdown = document.getElementById("unit-dropdown-menu");
const hourlyBtn = document.getElementById("dropdown-hourly-btn");
const hourlyDropdown = document.getElementById("dropdown-hourly-menu");

unitBtn.addEventListener("click", () => {
  unitDropdown.style.display =
    unitDropdown.style.display === "flex" ? "none" : "flex";
});

hourlyBtn.addEventListener("click", () => {
  hourlyDropdown.style.display =
    hourlyDropdown.style.display === "flex" ? "none" : "flex";
});

document.addEventListener("click", (event) => {
  if (!unitBtn.contains(event.target) && !hourlyBtn.contains(event.target)) {
    unitDropdown.style.display = "none";
    hourlyDropdown.style.display = "none";
  }
});
