// Geolocation utility for country-based content filtering
// Supports: France (FR), United Kingdom (UK), Germany (DE), Netherlands (NL), Portugal (PT)

const SUPPORTED_COUNTRIES = {
  FR: { name: "France", flag: "\u{1F1EB}\u{1F1F7}", code: "fr" },
  UK: { name: "United Kingdom", flag: "\u{1F1EC}\u{1F1E7}", code: "gb" },
  DE: { name: "Germany", flag: "\u{1F1E9}\u{1F1EA}", code: "de" },
  NL: { name: "Netherlands", flag: "\u{1F1F3}\u{1F1F1}", code: "nl" },
  PT: { name: "Portugal", flag: "\u{1F1F5}\u{1F1F9}", code: "pt" },
};

const STORAGE_KEY = "selectedCountry";
const DEFAULT_COUNTRY = "FR";

/**
 * Get the currently selected country
 * @returns {string} Country code (FR, UK, DE, NL, PT)
 */
export function getSelectedCountry() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_COUNTRIES[stored]) {
    return stored;
  }
  return DEFAULT_COUNTRY;
}

/**
 * Set the selected country
 * @param {string} countryCode - Country code (FR, UK, DE, NL, PT)
 */
export function setSelectedCountry(countryCode) {
  if (SUPPORTED_COUNTRIES[countryCode]) {
    localStorage.setItem(STORAGE_KEY, countryCode);
    return true;
  }
  return false;
}

/**
 * Get all supported countries
 * @returns {Object} Countries configuration
 */
export function getSupportedCountries() {
  return SUPPORTED_COUNTRIES;
}

/**
 * Get country info
 * @param {string} countryCode - Country code (FR, UK, DE, NL, PT)
 * @returns {Object} Country info
 */
export function getCountryInfo(countryCode) {
  return SUPPORTED_COUNTRIES[countryCode] || SUPPORTED_COUNTRIES[DEFAULT_COUNTRY];
}

/**
 * Get playlist URL for a country and type
 * @param {string} countryCode - Country code (FR, UK, DE, NL, PT)
 * @param {string} type - Playlist type (home, iptv, radio)
 * @returns {string} Playlist URL
 */
export function getPlaylistUrl(countryCode, type) {
  const countryInfo = SUPPORTED_COUNTRIES[countryCode] || SUPPORTED_COUNTRIES[DEFAULT_COUNTRY];
  const countryISOCode = countryInfo.code;

  const playlists = {
    home: `https://iptv-org.github.io/iptv/countries/${countryISOCode}.m3u`,
    iptv: "https://iptv-org.github.io/iptv/index.m3u",
    radio: `https://iptv-org.github.io/iptv/countries/${countryISOCode}.m3u`,
  };

  return playlists[type] || playlists.home;
}
