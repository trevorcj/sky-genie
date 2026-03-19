"use strict";

// Selecting elements
const input = document.querySelector("#city-input");
const btn = document.querySelector("#search-btn");

const cityEl = document.querySelector("#city");
const tempEl = document.querySelector("#temp");
const windEl = document.querySelector("#wind");
const conditionEl = document.querySelector("#conditions");

const weatherBox = document.querySelector("#weather");
const loading = document.querySelector("#loading");
const error = document.querySelector("#error");

// Events
btn.addEventListener("click", () => {
  const city = input.value.trim();
  if (!city) return;

  getWeather(city);
});

async function getWeather(city) {
  try {
    // Show the loader
    loading.classList.remove("hidden");

    // hide the error
    error.classList.add("hidden");

    const res = await fetch(`https://goweather.xyz/weather/${city}`);
    if (!res.ok) throw new Error("Error fetching data from API");

    const weatherData = await res.json();

    displayWeather(city, weatherData);
  } catch (err) {
    error.textContent = err.message;
    error.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

function displayWeather(city, data) {
  cityEl.textContent = city;
  input.value = "";

  // const temperature = data.forecast[0].temperature.split(" ")[0].slice(1);
  const temperature = data.temperature.split(" ")[0];
  tempEl.textContent = temperature;

  const wind = data.wind.split(" ")[0];
  windEl.textContent = `${wind}km/h`;

  let condition;
  if (data.description.toLowerCase().includes("sun")) {
    condition = `
    <span><i class="fa-solid fa-sun"></i>Condition</span>
    <p>${data.description}</p>
    `;
  } else if (data.description.toLowerCase().includes("rain")) {
    condition = `
    <span><i class="fa-solid fa-cloud-showers-heavy"></i>Condition</span>
    <p>${data.description}</p>
    `;
  } else {
    condition = `
    <span><i class="fa-regular fa-cloud"></i>Condition</span>
    <p>${data.description}</p>
    `;
  }

  conditionEl.innerHTML = condition;

  weatherBox.classList.remove("hidden");
}

// Get user location (city)
async function getUserCity() {
  const res = await fetch("https://ipapi.co/json/");
  const data = await res.json();
  return data.city;
}

async function init() {
  try {
    error.classList.add("hidden");

    const city = await getUserCity();

    getWeather(city);
  } catch (err) {
    console.error(err);
    error.textContent = err.message;
    error.classList.remove("hidden");
  }
}
init();
