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
  // console.log(city);

  try {
    const cityData = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`
    );

    const data = await cityData.json();
    // console.log(data.results[0]);

    const locationDisplay = document.getElementById("location-data");

    if (data.results && data.results.length > 0) {
      const latitude = data.results[0].latitude;
      const longitude = data.results[0].longitude;
      // console.log("Latitude:", latitude, "Longitude:", longitude);
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
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation,weather_code`
    );
    const data = await weather.json();
    console.log(data);

    const currentTime = data.current.time;

    const date = new Date(currentTime);
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const currentDayIndex = date.getDay(); //

    // Map the next 7 days starting from the current day
    const nextWeekdays = [];
    for (let i = 0; i < 7; i++) {
      nextWeekdays.push(weekdays[(currentDayIndex + i) % 7]);
    }

    // Display current date in the required format
    const formattedDate = `${nextWeekdays[0]}, ${date.toLocaleString(
      "default",
      { month: "short" }
    )} ${date.getDate()}, ${date.getFullYear()}`;
    const dateDisplay = document.getElementById("date-display");
    dateDisplay.innerText = formattedDate;

    // Mapping of weather codes to weather icons
    const weatherIconMatch = {
      0: "sunny",
      1: "sunny",
      2: "partly-cloudy",
      3: "partly-cloudy",
      4: "overcast",
      5: "overcast",
      6: "fog",
      7: "fog",
      8: "drizzle",
      9: "rain",
      10: "rain",
      11: "snow",
      12: "snow",
      13: "snow",
      14: "storm",
      15: "storm",
      16: "snow",
      17: "snow",
      18: "snow",
    };

    const weatherCode = data.current.weather_code;
    const weatherIcon = weatherIconMatch[weatherCode] || "sunny";

    // Display current weather
    const temp = data.current.temperature_2m;
    const tempDisplay = document.getElementById("temp");
    tempDisplay.innerText = temp;

    const feelsLikeTemp = data.current.apparent_temperature;
    const feelsLikeDisplay = document.getElementById("feels-like-data");
    feelsLikeDisplay.innerText = feelsLikeTemp + String.fromCharCode(176);

    const windSpeed = data.current.wind_speed_10m;
    const windSpeedDisplay = document.getElementById("wind-speed-data");
    windSpeedDisplay.innerText = windSpeed + " km/h";

    const humidity = data.current.relative_humidity_2m;
    const humidityDisplay = document.getElementById("humidity-data");
    humidityDisplay.innerText = humidity + "%";

    const precipitation = data.current.precipitation;
    const precipitationDisplay = document.getElementById("precipitation-data");
    precipitationDisplay.innerText = precipitation + " mm";

    const weatherIconDisplay = document.getElementById("weather-icon");
    weatherIconDisplay.src = `./assets/images/icon-${weatherIcon}.webp`;

    // Daily forecast section
    const dailyTempMax = data.daily.temperature_2m_max;
    const dailyTempMin = data.daily.temperature_2m_min;
    const dailyWeatherCode = data.daily.weather_code;

    const dailyForecastGrid = document.querySelector(".daily-forecast-grid");

    dailyForecastGrid.innerHTML = "";
    for (let i = 0; i < 7; i++) {
      const forecastItem = document.createElement("div");
      const day = nextWeekdays[i];
      const maxTemp = dailyTempMax[i];
      const minTemp = dailyTempMin[i];
      const weatherCodeDaily = dailyWeatherCode[i];

      const weatherIcon = weatherIconMatch[weatherCodeDaily] || "sunny"; // Default to sunny if code doesn't match

      forecastItem.innerHTML = `
        <ul>
          <li class="daily-forecast-header">${day}</li>
          <li><img src="./assets/images/icon-${weatherIcon}.webp" alt="${day} weather icon" class="daily-weather-icon"></li>
          <div class="daily-forecast-row">
            <li>${maxTemp}&deg;</li>
            <li>${minTemp}&deg;</li>
          </div>
        </ul>
      `;

      dailyForecastGrid.appendChild(forecastItem);
    }

    // hourly forecast section
    const hourlyTime = document.querySelector(".time");
    hourlyTime.innerHTML = "";
    const hourlyWeatherCode = data.hourly.weather_code;
    const hourlyTemp = data.hourly.temperature_2m;
    const hour = data.hourly.time;

    for (let i = 0; i < 24; i++) {
      const hourlyItem = document.createElement("div");

      const date = new Date(hour[i]);
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      const time = date.toLocaleString("en-US", options);

      const hourlyWeather = hourlyWeatherCode[i];
      const timeTemp = hourlyTemp[i];
      const weatherIcon = weatherIconMatch[hourlyWeather] || "sunny";

      hourlyItem.innerHTML = `
    <li>
      <div class="time-icon">
        <img src="./assets/images/icon-${weatherIcon}.webp" alt="${weatherIcon} icon">
        ${time}
      </div>
      ${timeTemp}&deg;
    </li>
  `;

      hourlyTime.appendChild(hourlyItem);
    }
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
