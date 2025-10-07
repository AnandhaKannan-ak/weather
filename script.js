document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "437804075051b404028f9f103419ffa3";
  const searchBtn = document.getElementById("search-btn");
  const cityInput = document.getElementById("city-input");
  const unitToggle = document.getElementById("unit-toggle");
  const suggestionBox = document.getElementById("suggestion-box");
  const weatherIcon = document.querySelector(".weather-icon img");
  const newYork = document.querySelector(".newyork-btn");
  const london = document.querySelector(".london-btn");
  const tokyo = document.querySelector(".tokyo-btn");

  let isCelsius = true;

  async function getWeather(city) {
    const unit = isCelsius ? "metric" : "imperial";
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`
    );
    if (response.status == 404) {
      document.querySelector(".error").style.display = "block";
      document.querySelector(".weather-info").style.display = "none";
    } else {
      const data = await response.json();
      console.log(" Parsed JSON data:", data);

      document.getElementById("temperature").textContent = `${Math.round(
        data.main.temp
      )}°${isCelsius ? "C" : "F"}`;
      const description = data.weather[0].description;
      document.getElementById("description").textContent =
        description.charAt(0).toUpperCase() + description.slice(1);
      document.getElementById(
        "feels-like"
      ).textContent = `Feels like ${Math.round(data.main.feels_like)}°${
        isCelsius ? "C" : "F"
      }`;
      document.getElementById("wind").textContent = `${data.wind.speed} ${
        isCelsius ? "km/h" : "mph"
      }`;
      document.getElementById(
        "humidity"
      ).textContent = `${data.main.humidity}%`;
      document.getElementById("uv").textContent = "5 (Moderate)";
      if (data.weather[0].main == "Clouds") {
        weatherIcon.src = "img/cloudy.png";
      } else if (data.weather[0].main == "Clear") {
        weatherIcon.src = "img/sun.png";
      } else if (data.weather[0].main == "Rain") {
        weatherIcon.src = "img/rainy-day.png";
      } else if (data.weather[0].main == "Mist") {
        weatherIcon.src = "img/windy.png";
      } else if (data.weather[0].main == "HeavyRain") {
        weatherIcon.src = "img/heavy-rain.png";
      }
      document.querySelector(".weather-info").style.display = "block";
      document.querySelector(".error").style.display = "none";
    }
  }
  async function getCitySuggestions(query) {
    if (query.length < 2) {
      suggestionBox.style.display = "none";
      return;
    }

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(" Parsed JSON data:", data);

    suggestionBox.innerHTML = "";

    if (data.length === 0) {
      suggestionBox.style.display = "none";
      return;
    }

    data.forEach((city) => {
      const li = document.createElement("li");
      li.textContent = `${city.name},${city.state},${city.country}`;
      li.addEventListener("click", () => {
        cityInput.value = city.name;
        suggestionBox.innerHTML = "";
        suggestionBox.style.display = "none";
        getWeather(city.name);
      });
      suggestionBox.appendChild(li);
    });

    suggestionBox.style.display = "block";
  }

  cityInput.addEventListener("input", () =>
    getCitySuggestions(cityInput.value)
  );
  searchBtn.addEventListener("click", () => getWeather(cityInput.value));
  cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      suggestionBox.style.display = "none";
      getWeather(cityInput.value);
    }
  });

  unitToggle.addEventListener("change", () => {
    isCelsius = !isCelsius;
    getWeather(cityInput.value);
  });

  newYork.addEventListener("click", () => {
    getWeather("New York");
  });

  london.addEventListener("click", () => {
    getWeather("London");
  });

  tokyo.addEventListener("click", () => {
    getWeather("Tokyo");
  });
});
