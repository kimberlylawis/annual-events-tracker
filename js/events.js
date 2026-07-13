// Date/countdown math and deterministic category colors.
const Events = (() => {
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const CATEGORY_PALETTE = [
    '#e07a5f', '#3d5a80', '#81b29a', '#f2cc8f', '#9b5de5',
    '#00b4d8', '#e56b6f', '#588157', '#f4a261', '#577590',
  ];

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  function buildDate(year, month, day) {
    if (month === 2 && day === 29 && !isLeapYear(year)) {
      return new Date(year, 2, 1); // fall back to March 1 on non-leap years
    }
    return new Date(year, month - 1, day);
  }

  function daysUntilNext(month, day) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const year = today.getFullYear();

    let candidate = buildDate(year, month, day);
    if (candidate < today) {
      candidate = buildDate(year + 1, month, day);
    }

    const diffMs = candidate.getTime() - today.getTime();
    return { days: Math.round(diffMs / 86400000), occursOnYear: candidate.getFullYear() };
  }

  function formatDate(month, day) {
    return `${MONTH_NAMES[month - 1]} ${day}`;
  }

  function ordinalSuffix(n) {
    const rem100 = n % 100;
    if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
    switch (n % 10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  }

  function anniversaryLabel(originYear, occursOnYear) {
    if (!originYear) return null;
    const count = occursOnYear - originYear;
    if (count <= 0) return null;
    return `${ordinalSuffix(count)} anniversary`;
  }

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function colorForCategory(name) {
    const key = (name || '').trim().toLowerCase();
    const idx = hashString(key) % CATEGORY_PALETTE.length;
    return CATEGORY_PALETTE[idx];
  }

  return { MONTH_NAMES, daysUntilNext, formatDate, anniversaryLabel, colorForCategory, isLeapYear };
})();
