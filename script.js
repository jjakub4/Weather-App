// importing the open-meteo API

async function getData() {
  const response = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m"
  );
  const data = await response.json();
  console.log(data);
}

getData();

// getting the user's location for weather data
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    return;
  }
}
function showPosition(position) {
  console.log(
    "Latitude: " +
      position.coords.latitude +
      "Longitude: " +
      position.coords.longitude
  );
}
getLocation();

// searchbar section
const searchbar = document.getElementById("searchbar");
const searchBtn = document.getElementById("search-btn");

// handling dropdowns
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
  if (!unitBtn.contains(event.target) || !hourlyBtn.contains(event.target)) {
    unitDropdown.style.display = "none";
  }
});
