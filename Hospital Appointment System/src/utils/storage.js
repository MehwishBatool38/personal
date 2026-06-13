import { generateSampleData } from "../data/sampleData";

const STORAGE_KEY = "medicore-hms-data-v1";
const AUTH_KEY = "medicore-hms-auth-v1";
const THEME_KEY = "medicore-hms-theme-v1";

function readJson(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage may be unavailable in private or restricted browser contexts.
    }
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The app can still run if storage is blocked or full.
  }
}

function buildSeed() {
  return generateSampleData();
}

function normalizeData(data) {
  const seed = buildSeed();
  if (!data || typeof data !== "object") return seed;

  return Object.fromEntries(
    Object.entries(seed).map(([key, fallback]) => [key, Array.isArray(data[key]) ? data[key] : fallback])
  );
}

export function loadData() {
  const stored = readJson(STORAGE_KEY, null);
  const data = normalizeData(stored);
  saveData(data);
  return data;
}

export function saveData(data) {
  writeJson(STORAGE_KEY, data);
}

export function resetData() {
  const seed = buildSeed();
  saveData(seed);
  return seed;
}

export function loadAuth() {
  return readJson(AUTH_KEY, null);
}

export function saveAuth(user) {
  try {
    if (!user) localStorage.removeItem(AUTH_KEY);
    else writeJson(AUTH_KEY, user);
  } catch {
    // Ignore storage failures; the current session can continue.
  }
}

export function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || "light";
  } catch {
    return "light";
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Theme persistence is optional.
  }
}
