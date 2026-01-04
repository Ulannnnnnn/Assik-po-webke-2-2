async function getWeatherByCity(city, apiKey) {
  if (!city) {
    const err = new Error("City is required");
    err.status = 400;
    throw err;
  }

  if (!apiKey) {
    const err = new Error("Missing OpenWeather API key");
    err.status = 500;
    throw err;
  }

  const url =
    "https://api.openweathermap.org/data/2.5/weather" +
    `?q=${encodeURIComponent(city)}` +
    "&units=metric" +
    "&appid=" + apiKey;

  const response = await fetch(url);
  const data = await response.json();

  if (response.status === 404) {
    const err = new Error("City not found");
    err.status = 404;
    throw err;
  }

  if (!response.ok) {
    const err = new Error("Weather service error");
    err.status = 500;
    throw err;
  }

  return {
  city: data.name,
  countryCode: data.sys.country,
  coord: data.coord,

  temp: data.main.temp,
  feelsLike: data.main.feels_like,
  humidity: data.main.humidity,
  pressure: data.main.pressure,

  windSpeed: data.wind.speed,
  description: data.weather[0].description,
  icon: data.weather[0].icon,

  rain3h: data?.rain?.["3h"] ?? 0
};

}

module.exports = { getWeatherByCity };
