// Initialize variables for storing the user's latitude and longitude
let userLatitude;
let userLongitude;

/* function getLocation() {
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
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}
*/
// Searchbar section for user input
const searchbar = document.getElementById("searchbar");
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", getCity);

// getting city coordinates from the input value, to be used to fetch weatehr data
async function getCity() {
  let city = searchbar.value.trim();
  console.log(city);

  try {
    const cityData = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`
    );

    const data = await cityData.json();
    console.log(data.results[0]);

    const locationDisplay = document.getElementById("location-data");

    if (data.results && data.results.length > 0) {
      const latitude = data.results[0].latitude;
      const longitude = data.results[0].longitude;
      console.log("Latitude:", latitude, "Longitude:", longitude);
      getCityWeather(latitude, longitude);

      let location =
        data.results[0].name.toString() +
        "," +
        " " +
        data.results[0].country.toString();
      locationDisplay.innerText = location;
    } else {
      console.log("No results found for the city.");
    }
  } catch (error) {
    console.error("Error fetching city data:", error);
  }
}

//using the coords to fetch weather
async function getCityWeather(latitude, longitude) {
  try {
    const weather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m`
    );
    const data = await weather.json();
    // console.log(data);
    const temp = data.current.temperature_2m;
    // console.log(temp);
    const tempDisplay = document.getElementById("temp");
    tempDisplay.innerText = temp;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

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
