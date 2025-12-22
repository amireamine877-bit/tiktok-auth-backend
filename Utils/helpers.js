function safeNumber(x) {
  const n = Number(x);
  return isNaN(n) ? 0 : n;
}

module.exports = { safeNumber };
