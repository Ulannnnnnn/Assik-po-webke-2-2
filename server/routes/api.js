const express = require("express");
const router = express.Router();
const { getWeatherByCity } = require("../services/openWeather");

router.get("/weather", async (req, res, next) => {
  try {
    const city = req.query.city;
    const data = await getWeatherByCity(city, process.env.OPENWEATHER_API_KEY);
    res.json(data);
  } catch (err) {
    next(err);
  }
});
const { getCountryByCode } = require("../services/countries");
const { getRate } = require("../services/currency");

router.get("/country", async (req, res, next) => {
  try {
    const code = (req.query.code || "").trim().toUpperCase();
    if (!code) {
      const err = new Error("Query 'code' is required");
      err.status = 400;
      throw err;
    }
    const country = await getCountryByCode(code);
    res.json(country);
  } catch (err) {
    next(err);
  }
});

router.get("/currency", async (req, res, next) => {
  try {
    const base = (req.query.base || "").trim().toUpperCase();
    const symbols = (req.query.symbols || "").trim().toUpperCase();

    if (!base || base.length !== 3) {
      const err = new Error("Query 'base' must be 3-letter code (e.g., USD)");
      err.status = 400;
      throw err;
    }
    if (!symbols || symbols.length !== 3) {
      const err = new Error("Query 'symbols' must be 3-letter code (e.g., KZT)");
      err.status = 400;
      throw err;
    }

    const rate = await getRate(base, symbols);
    res.json(rate);
  } catch (err) {
    next(err);
  }
});


module.exports = router;
