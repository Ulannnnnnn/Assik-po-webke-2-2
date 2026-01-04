async function getCountryByCode(code) {
  const res = await fetch(`https://restcountries.com/v3.1/alpha/${encodeURIComponent(code)}`);
  const data = await res.json();

  if (res.status === 404) {
    const err = new Error("Country not found");
    err.status = 404;
    throw err;
  }
  if (!res.ok) {
    const err = new Error("Country provider error");
    err.status = 502;
    throw err;
  }

  const c = data?.[0];
  const currencies = c?.currencies ? Object.keys(c.currencies) : [];
  const languages = c?.languages ? Object.values(c.languages) : [];

  return {
    name: c?.name?.common || "",
    capital: c?.capital?.[0] || "",
    region: c?.region || "",
    population: c?.population || 0,
    currencies,
    languages,
    flag: c?.flag || ""
  };
}

module.exports = { getCountryByCode };
