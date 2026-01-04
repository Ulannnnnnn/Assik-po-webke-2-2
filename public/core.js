let map;
let marker;

const $ = (id) => document.getElementById(id);

function showError(message) {
  const box = $("errorBox");
  box.textContent = message;
  box.classList.remove("hidden");
}

function clearError() {
  const box = $("errorBox");
  box.textContent = "";
  box.classList.add("hidden");
}


function fmtNum(n) {
  if (typeof n !== "number") return "—";
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

function formatPopulation(n) {
  if (typeof n !== "number") return "—";
  return n.toLocaleString();
}

function initMap(lat = 43.238949, lon = 76.889709, label = "Default (Almaty)") {
  if (!map) {
    map = L.map("map").setView([lat, lon], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);
    marker = L.marker([lat, lon]).addTo(map);
  } else {
    map.setView([lat, lon], 10);
    marker.setLatLng([lat, lon]);
  }
  $("mapHint").textContent = label;
}

async function apiGet(url) {
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}


function fillWeather(w) {
  $("place").textContent = w.city ? `${w.city}` : "—";
  $("meta").textContent = w.countryCode
    ? `Country: ${w.countryCode} • Provider: OpenWeather`
    : "Demo mode (no OpenWeather yet)";

  $("temp").textContent = w.temp != null ? `${fmtNum(w.temp)}°` : "—°";
  $("desc").textContent = (w.description || "—");

  $("feels").textContent = w.feelsLike != null ? `${fmtNum(w.feelsLike)}°` : "—";
  $("hum").textContent = w.humidity != null ? `${fmtNum(w.humidity)}%` : "—";
  $("press").textContent = w.pressure != null ? `${fmtNum(w.pressure)} hPa` : "—";
  $("wind").textContent = w.windSpeed != null ? `${fmtNum(w.windSpeed)} m/s` : "—";
  $("rain").textContent = w.rain3h != null ? `${fmtNum(w.rain3h)} mm` : "—";
  $("coords").textContent =
    w.coord?.lat != null ? `${fmtNum(w.coord.lat)}, ${fmtNum(w.coord.lon)}` : "—";

  if (w.coord?.lat != null && w.coord?.lon != null) {
    initMap(w.coord.lat, w.coord.lon, `${w.city} (${w.countryCode || "—"})`);
  }
}

function fillCountry(c) {
  $("flag").textContent = c.flag || "🏳️";
  $("cName").textContent = c.name || "—";
  $("cCap").textContent = c.capital || "—";
  $("cReg").textContent = c.region || "—";
  $("cPop").textContent = formatPopulation(c.population);
  $("cLang").textContent = (c.languages || []).slice(0, 3).join(", ") || "—";
  $("cCur").textContent = (c.currencies || []).join(", ") || "—";
}

function fillRate(r, base, symbol) {
  $("rateLine").textContent = `1 ${base} = ${fmtNum(r.rate)} ${symbol}`;
}

async function runReal(city) {
  clearError();
  

  
  const weather = await apiGet(`/api/weather?city=${encodeURIComponent(city)}`);
  fillWeather(weather);

  const country = await apiGet(`/api/country?code=${encodeURIComponent(weather.countryCode)}`);
  fillCountry(country);

  const symbol = (country.currencies && country.currencies[0]) ? country.currencies[0] : "USD";
  const base = "USD";

 
  const rate = await apiGet(`/api/currency?base=${base}&symbols=${symbol}`);
  fillRate(rate, base, symbol);
}

async function runDemo() {
  clearError();
  const weather = {
    city: "Astana",
    countryCode: "KZ",
    temp: -6,
    feelsLike: -10,
    humidity: 72,
    pressure: 1024,
    windSpeed: 4.1,
    description: "demo: clear sky",
    rain3h: 0,
    coord: { lat: 51.1694, lon: 71.4491 }
  };
  fillWeather(weather);

  const country = await apiGet(`/api/country?code=KZ`);
  fillCountry(country);

  const symbol = (country.currencies && country.currencies[0]) ? country.currencies[0] : "KZT";
  const base = "USD";
  const rate = await apiGet(`/api/currency?base=${base}&symbols=${symbol}`);
  fillRate(rate, base, symbol);

 
}

document.addEventListener("DOMContentLoaded", () => {
  initMap();


  $("searchForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = $("cityInput").value.trim();
    if (!city) return showError("Type a city name first.");
    try {
      await runReal(city);
    } catch (err) {
      showError(err.message);
    }
  });

  $("demoBtn").addEventListener("click", async () => {
    try {
      await runDemo();
    } catch (err) {
      showError(err.message);
    }
  });
});
