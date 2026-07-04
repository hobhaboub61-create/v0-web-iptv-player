<template>
  <Nav :tvs="tvs" :active="url" :mode="currentMode" :loading="loading" :currentCountry="selectedCountry" @switchMode="switchMode" @openSettings="showSettings = true" @openAnalytics="showAnalytics = true" @openShareLink="showShareLink = true" />
  <Settings :isOpen="showSettings" @close="showSettings = false" @countryChanged="onCountryChanged" />
  <AnalyticsDashboard :isOpen="showAnalytics" @close="showAnalytics = false" />
  <ShareLink :isOpen="showShareLink" :url="url" :caption="caption" :mode="currentMode" @close="showShareLink = false" />
  <component :is="currentView" :value="url" :track="caption" />
</template>

<script setup>
import { listTv } from "./api";
import { parse, suffix } from "./utils/tvlistsupport";
import { ref, computed, onMounted, watch } from "vue";
import Home from "./views/Index.vue";
import NotFound from "./views/NotFound.vue";
import Nav from "./components/Nav.vue";
import Settings from "./components/Settings.vue";
import AnalyticsDashboard from "./components/AnalyticsDashboard.vue";
import ShareLink from "./components/ShareLink.vue";
import { useI18n } from "./i18n/index.js";
import { getSelectedCountry, getPlaylistUrl } from "./utils/geolocation.js";
import { useTracking } from "./composables/useTracking.js";
import { parseShortLink, createShortLink, cleanupOldMappings } from "./services/urlShortener.js";
import { performanceService } from "./services/performanceService.js";

const { t, locale } = useI18n();
const { initializeTracking, trackInteraction, cleanup } = useTracking();

// Primary IPTV sources (2026 updated)
const IPTV_URL = "https://iptv-org.github.io/iptv/index.m3u";
const IPTV_URL_BACKUP = "https://raw.githubusercontent.com/iptv-org/iptv/master/index.m3u";

// Radio sources with multiple quality options
const RADIO_GLOBAL_URL = "https://iptv-org.github.io/iptv/categories/music.m3u";
const RADIO_GLOBAL_URL_BACKUP = "https://raw.githubusercontent.com/iptv-org/iptv/master/categories/music.m3u";

const routes = { "/": Home };
const currentPath = ref(window.location.hash);
const url = ref("");
const tvs = ref([]);
const caption = ref("");
const currentMode = ref("home");
const loading = ref(false);
const showSettings = ref(false);
const showAnalytics = ref(false);
const showShareLink = ref(false);
const selectedCountry = ref(getSelectedCountry());

// Advanced cache for loaded playlists with TTL
const playlistCache = {};
const CACHE_TTL = 3600000; // 1 hour
function getCachedPlaylist(key) {
  const cached = playlistCache[key];
  if (!cached) return null;
  
  // Check if cache is still valid
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    delete playlistCache[key];
    return null;
  }
  return cached.data;
}

function setCachedPlaylist(key, data) {
  playlistCache[key] = {
    data,
    timestamp: Date.now()
  };
}

window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash;
});

const currentView = computed(() => {
  try {
    const hash = currentPath.value || "#/";
    if (typeof hash !== 'string') {
      return Home;
    }
    
    // Check if it's a short link format (#/s/code)
    const shortLinkConfig = parseShortLink(hash);
    if (shortLinkConfig) {
      url.value = shortLinkConfig.url;
      caption.value = shortLinkConfig.caption || '';
      const mode = shortLinkConfig.mode || 'home';
      
      if (mode) {
        const previousMode = currentMode.value;
        currentMode.value = mode;

        if (previousMode !== mode && !shortLinkConfig.url) {
          loadPlaylistForMode(mode, true);
        }
      }
    } else if (hash.slice(1).includes("?")) {
      // Handle long URL format (#/?url=...&caption=...&mode=...)
      const searchParams = new URLSearchParams(hash.slice(hash.indexOf("?")));
      const newUrl = searchParams.get("url");
      const newCaption = searchParams.get("caption");
      const mode = searchParams.get("mode");

      if (newUrl) url.value = decodeURIComponent(newUrl);
      if (newCaption) caption.value = decodeURIComponent(newCaption);

      if (mode) {
        const previousMode = currentMode.value;
        currentMode.value = mode;

        if (previousMode !== mode && !newUrl) {
          loadPlaylistForMode(mode, true);
        }
      }
    }
    
    // Always return a valid component
    return Home;
  } catch (error) {
    console.error("[v0] Error in currentView computed:", error);
    return Home;
  }
});

function switchMode(mode) {
  currentMode.value = mode;
  loadPlaylistForMode(mode, true);
  trackInteraction('nav_mode_switch', 'switch', { newMode: mode });
}

function loadPlaylistForMode(mode, preserveSelection = false) {
  let playlistUrl;

  if (mode === "iptv") {
    playlistUrl = IPTV_URL;
  } else if (mode === "radio") {
    playlistUrl = RADIO_GLOBAL_URL;
  } else {
    playlistUrl = getPlaylistUrl(selectedCountry.value, "home");
  }

  loadPlaylist(playlistUrl, mode, preserveSelection);
}

function onCountryChanged(country) {
  selectedCountry.value = country;
}

async function loadPlaylist(playlistUrl, mode = "home", preserveSelection = false) {
  if (!playlistUrl) {
    const params = new URLSearchParams(window.location.hash.replace("#/", ""));
    playlistUrl = params.get("s");

    if (!playlistUrl) {
      if (mode === "iptv") {
        playlistUrl = IPTV_URL;
      } else if (mode === "radio") {
        playlistUrl = RADIO_GLOBAL_URL;
      } else {
        playlistUrl = getPlaylistUrl(selectedCountry.value, "home");
      }
    }
  }

  // Check cache first with TTL validation
  const cachedData = getCachedPlaylist(playlistUrl);
  if (cachedData) {
    let cached = cachedData;

    if (mode === "radio") {
      cached = filterRadios(cached);
    }

    tvs.value = cached;
    if (!preserveSelection) {
      selectFirstChannel();
    }
    return;
  }

  loading.value = true;
  
  // Define fallback URLs based on mode
  let fallbackUrls = [playlistUrl];
  if (mode === "iptv" && playlistUrl === IPTV_URL) {
    fallbackUrls.push(IPTV_URL_BACKUP);
  } else if (mode === "radio" && playlistUrl === RADIO_GLOBAL_URL) {
    fallbackUrls.push(RADIO_GLOBAL_URL_BACKUP);
  }
  
  let lastError;
  for (const url of fallbackUrls) {
    try {
      let suffixName = suffix(url);
      if (suffixName === "m3u8") suffixName = "m3u";

      const d = await listTv(url);
      let parsed = parse(d.data, suffixName);

      if (mode === "radio") {
        parsed = filterRadios(parsed);
      }

      setCachedPlaylist(playlistUrl, parsed);
      tvs.value = parsed;

      if (mode === "home") {
        localStorage.setItem("tvlistUrl", playlistUrl);
      }

      if (!preserveSelection) {
        selectFirstChannel();
      }
      
      loading.value = false;
      return; // Success, exit function
    } catch (e) {
      lastError = e;
      console.warn(`Failed to load playlist from ${url}, trying fallback...`, e);
    }
  }
  
  // All sources failed
  console.error("Failed to load playlist from all sources:", lastError);
  tvs.value = [{ name: t("failedToLoad"), isTv: false }];
  loading.value = false;
}

function filterRadios(channels) {
  return channels.filter((channel) => {
    if (!channel.isTv) return true;

    const name = (channel.name || "").toLowerCase();
    const groupTitle = (channel.meta?.["group-title"] || "").toLowerCase();

    const isRadio =
      name.includes("radio") ||
      name.includes("fm") ||
      groupTitle.includes("radio") ||
      groupTitle.includes("audio");

    return isRadio;
  });
}

function selectFirstChannel() {
  if (!url.value || currentMode.value === "iptv") {
    const firstTv = tvs.value.find((t) => t.isTv);
    if (firstTv) {
      url.value = firstTv.url;
      caption.value = firstTv.caption;
    }
  }
}

// Watch for country changes and reload playlist in HOME mode
watch(
  () => selectedCountry.value,
  () => {
    if (currentMode.value === "home") {
      loadPlaylistForMode("home");
    }
  }
);

onMounted(async () => {
  // Initialize performance monitoring
  performanceService.startMonitoring();
  
  // Initialize tracking
  await initializeTracking();
  
  // Clean up old URL mappings
  cleanupOldMappings();
  
  const params = new URLSearchParams(window.location.hash.replace("#/", ""));
  const url0 = params.get("url");
  const mode = params.get("mode") || "home";

  if (url0) url.value = decodeURIComponent(url0);
  caption.value = params.get("caption");
  currentMode.value = mode;

  loadPlaylistForMode(mode);
  
  // Track page load event
  trackInteraction('app_load', 'page_load', { mode });
  
  // Cleanup on unload
  window.addEventListener('beforeunload', cleanup);
});
</script>
