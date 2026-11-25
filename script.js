const searchBtn = document.getElementById("search_button");
let cityName;
let results = document.querySelector(".result_container")
searchBtn.addEventListener("click", getGeography)

async function getGeography() {
    try {
        cityName = document.getElementById("city_name").value.trim();

        if (cityName === "") {
            results.innerHTML = `<p>Please Inter A Place Name!</p>`
            return;
        }

        let geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=fa&countryCode=IR`
        let response = await fetch(geoUrl)

        if (response.ok !== true) {
            throw new Error(404);
        }

        let data = await response.json();
        await showDetails(data)

    } catch (error) {
        console.log(error);
        if (!navigator.onLine) {
            results.innerHTML = `<p>Please Check Your Connection!</p>`
        } else {
            results.innerHTML = `<p>City Not Fond!</p>`
        }
    }
}

const weatherCode = {
    0: "☀️ Clear sky",
    1: "🌤️ Mainly clear",
    2: "⛅ Partly cloudy",
    3: "☁️ Overcast",
    45: "🌫️ Fog",
    48: "🌫️ Depositing rime fog",
    51: "🌦️ Light drizzle",
    53: "🌦️ Moderate drizzle",
    55: "🌧️ Dense drizzle",
    56: "🌧️ Light freezing drizzle",
    57: "🌧️ Dense freezing drizzle",
    61: "🌦️ Slight rain",
    63: "🌧️ Moderate rain",
    65: "🌧️ Heavy rain",
    66: "🌧️ Light freezing rain",
    67: "🌧️ Heavy freezing rain",
    71: "🌨️ Slight snowfall",
    73: "🌨️ Moderate snowfall",
    75: "❄️ Heavy snowfall",
    77: "❄️ Snow grains",
    80: "🌦️ Slight rain showers",
    81: "🌧️ Moderate rain showers",
    82: "⛈️ Violent rain showers",
    85: "🌨️ Slight snow showers",
    86: "❄️ Heavy snow showers"
};

async function showDetails(data) {
    results.innerHTML = "";

    const city = data.results[0];

    const div = document.createElement("div");
    div.classList.add("details_container");

    const province = document.createElement("div");
    province.textContent = city.admin1 || "";

    const country = document.createElement("div");
    country.textContent = city.country_code;

    const wethers = await getWeather(city.latitude, city.longitude);

    const temperature = document.createElement("div");
    temperature.innerHTML = `${wethers.current.temperature_2m}°C <span class="material-symbols-outlined">device_thermostat</span>`;
    temperature.style.display = "flex";
    temperature.style.alignItems = "center";
    temperature.style.gap = "5px";

    const rain = document.createElement("div");
    rain.innerHTML = `${wethers.current.precipitation ?? wethers.current.rain ?? 0} mm <span class="material-symbols-outlined" style="color:blue;">water_drop</span>`;
    rain.style.display = "flex";
    rain.style.alignItems = "center";
    rain.style.gap = "5px";
    console.log(rain);
    

    const weatherDescription = document.createElement("div");
    const code = wethers.current.weather_code;
    weatherDescription.innerHTML = weatherCode[code]

    const wind = document.createElement("div");
    wind.innerHTML = `${wethers.current.wind_speed_10m} km/h <span class="material-symbols-outlined" style="color:white;">air</span>`;
    wind.style.display = "flex";
    wind.style.alignItems = "center";
    wind.style.gap = "5px";

    div.append(province, country, temperature, rain, wind, weatherDescription);
    results.append(div);
}

async function getWeather(latitude, longitude) {
    let wetherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,wind_speed_10m,weather_code`
    let response = await fetch(wetherUrl)
    let wether = await response.json()
    console.log(wether);

    return wether;
}