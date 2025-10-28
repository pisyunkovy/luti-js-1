// js/utils/format.js
export const clamp = (str, n = 120) => (str.length > n ? str.slice(0, n) + '…' : str);
export const qNormalize = (s) => (s || '').toLowerCase().trim();
export const includes = (s, q) => q === '' || (s || '').toLowerCase().includes(q);
