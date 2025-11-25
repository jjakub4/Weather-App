const unitBtn = document.getElementById("unit-dropdown-btn");
const unitDropdown = document.getElementById("unit-dropdown-menu");
const tempSection = document.getElementById("temp-section");
const windSection = document.getElementById("wind-section");

unitBtn.addEventListener("click", () => {
  unitDropdown.style.display =
    unitDropdown.style.display === "flex" ? "none" : "flex";
});

let currentUnits = [
  { currentTempUnit: "Celsius" },
  { currentWindUnit: "kph" },
  { currentPrecUnit: "mm" },
];

function changeTempUnit(event) {
  let activeTempUnit = tempSection.querySelector(".currentTempUnit");

  if (activeTempUnit && activeTempUnit !== event.target) {
    activeTempUnit.classList.remove("currentTempUnit");
  }

  event.target.classList.add("currentTempUnit");

  if (event.target.textContent === "Fahrenheit") {
    currentUnits[0].currentTempUnit = "Fahrenheit";
    console.log("added fahrenheit!");
  } else {
    currentUnits[0].currentTempUnit = "Celsius";
    console.log("added celsius!");
  }

  console.log(currentUnits);
}
tempSection.addEventListener("click", changeTempUnit);

function changeWindUnit(event) {
  let activeWindUnit = windSection.querySelector(".currentWindUnit");

  if (activeWindUnit && activeWindUnit !== event.target) {
    activeWindUnit.classList.remove("currentWindUnit");
  }

  event.target.classList.add("currentWindUnit");

  if (event.target.textContent === "mph") {
    currentUnits[1].currentWindUnit = "mph";
    console.log("added mph!");
  } else {
    currentUnits[1].currentWindUnit = "kph";
    console.log("added kph!");
  }

  console.log(currentUnits);
}
windSection.addEventListener("click", changeWindUnit);

// Searchbar section for user input
const searchbar = document.getElementById("searchbar");
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", getCity);

// getting city coordinates from the input value, to be used to fetch weather data
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

// using the coords to fetch weather
async function getCityWeather(latitude, longitude) {
  try {
    let apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation,weather_code`;

    currentUnits.forEach((unit) => {
      if (unit.currentTempUnit === "Fahrenheit") {
        apiUrl += "&temperature_unit=fahrenheit&";
        console.log("added fahrenheit!");
      }

      if (unit.currentWindUnit === "mph") {
        apiUrl += "&wind_speed_unit=mph&";
        console.log("added mph!");
      }

      if (unit.currentPrecUnit === "in") {
        apiUrl += "&precipitation_unit=inch&";
        console.log("added inch!");
      }
    });

    console.log("Final API URL:", apiUrl);

    // Fetch the weather data
    const weather = await fetch(apiUrl);
    const data = await weather.json();
    console.log(data);

    // Process the weather data as usual
    const currentTime = data.current.time;
    const date = new Date(currentTime);
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const currentDayIndex = date.getDay();
    const nextWeekdays = [];
    for (let i = 0; i < 7; i++) {
      nextWeekdays.push(weekdays[(currentDayIndex + i) % 7]);
    }

    // Display current date
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
    tempDisplay.innerText = temp + String.fromCharCode(176);

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

    // Hourly forecast section
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

// handling unused dropdowns (TODO dropdowns)
const hourlyBtn = document.getElementById("dropdown-hourly-btn");
const hourlyDropdown = document.getElementById("dropdown-hourly-menu");

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
