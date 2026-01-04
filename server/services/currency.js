async function getRate(base, symbols) {
  const res = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`);
  const data = await res.json();

  if (!res.ok || data?.result !== "success") {
    const err = new Error("Currency provider error");
    err.status = 502;
    throw err;
  }

  const rate = data?.rates?.[symbols];
  if (!rate) {
    const err = new Error("Rate not found");
    err.status = 404;
    throw err;
  }

  return { base, symbol: symbols, rate };
}

module.exports = { getRate };
