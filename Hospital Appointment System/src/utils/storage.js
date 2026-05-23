import { generateSampleData } from "../data/sampleData";

const STORAGE_KEY = "medicore-hms-data-v1";
const AUTH_KEY = "medicore-hms-auth-v1";
const THEME_KEY = "medicore-hms-theme-v1";

export function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  const seed = generateSampleData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetData() {
  const seed = generateSampleData();
  saveData(seed);
  return seed;
}

export function loadAuth() {
  return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
}

export function saveAuth(user) {
  if (!user) localStorage.removeItem(AUTH_KEY);
  else localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
