<template>
  <Nav :tvs="tvs" :active="url" :mode="currentMode" :loading="loading" :currentCountry="selectedCountry" @switchMode="switchMode" @openSettings="showSettings = true" @openAnalytics="showAnalytics = true" />
  <Settings :isOpen="showSettings" @close="showSettings = false" @countryChanged="onCountryChanged" />
  <AnalyticsDashboard :isOpen="showAnalytics" @close="showAnalytics = false" />
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
import { useI18n } from "./i18n/index.js";
import { getSelectedCountry, getPlaylistUrl } from "./utils/geolocation.js";
import { useTracking } from "./composables/useTracking.js";

const { t, locale } = useI18n();
const { initializeTracking, trackInteraction, cleanup } = useTracking();

const IPTV_URL = "https://iptv-org.github.io/iptv/index.m3u";
const RADIO_GLOBAL_URL = "https://iptv-org.github.io/iptv/index.m3u";

const routes = { "/": Home };
const currentPath = ref(window.location.hash);
const url = ref("");
const tvs = ref([]);
const caption = ref("");
const currentMode = ref("home");
const loading = ref(false);
const showSettings = ref(false);
const showAnalytics = ref(false);
const selectedCountry = ref(getSelectedCountry());

// Cache for loaded playlists
const playlistCache = {};

window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash;
});

const currentView = computed(() => {
  const hash = currentPath.value;
  if (hash.slice(1).includes("?")) {
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
        loadPlaylistForMode(mode);
      }
    }
  }
  return routes[hash.slice(1).split("?")[0] || "/"] || NotFound;
});

function switchMode(mode) {
  currentMode.value = mode;
  loadPlaylistForMode(mode);
  trackInteraction('nav_mode_switch', 'switch', { newMode: mode });
}

function loadPlaylistForMode(mode) {
  let playlistUrl;

  if (mode === "iptv") {
    playlistUrl = IPTV_URL;
  } else if (mode === "radio") {
    playlistUrl = RADIO_GLOBAL_URL;
  } else {
    playlistUrl = getPlaylistUrl(selectedCountry.value, "home");
  }

  loadPlaylist(playlistUrl, mode);
}

function onCountryChanged(country) {
  selectedCountry.value = country;
}

async function loadPlaylist(playlistUrl, mode = "home") {
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

  // Check cache first
  if (playlistCache[playlistUrl]) {
    let cached = playlistCache[playlistUrl];

    if (mode === "radio") {
      cached = filterRadios(cached);
    }

    tvs.value = cached;
    selectFirstChannel();
    return;
  }

  loading.value = true;
  try {
    let suffixName = suffix(playlistUrl);
    if (suffixName === "m3u8") suffixName = "m3u";

    const d = await listTv(playlistUrl);
    let parsed = parse(d.data, suffixName);

    if (mode === "radio") {
      parsed = filterRadios(parsed);
    }

    playlistCache[playlistUrl] = parsed;
    tvs.value = parsed;

    if (mode === "home") {
      localStorage.setItem("tvlistUrl", playlistUrl);
    }

    selectFirstChannel();
  } catch (e) {
    console.error("Failed to load playlist:", e);
    tvs.value = [{ name: t("failedToLoad"), isTv: false }];
  } finally {
    loading.value = false;
  }
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
  // Initialize tracking
  await initializeTracking();
  
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
