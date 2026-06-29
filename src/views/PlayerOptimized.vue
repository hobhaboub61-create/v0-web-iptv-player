<template>
  <div class="player-container">
    <!-- Skeleton Loading State -->
    <div v-if="!playerReady && isLoading" class="skeleton-loader">
      <div class="skeleton-player"></div>
      <div class="skeleton-controls"></div>
    </div>

    <!-- Player Wrapper with Performance Optimizations -->
    <div v-show="playerReady" class="player-wrapper" ref="playerWrapper">
      <video-player 
        v-if="renderPlayer"
        :src="currentSrc" 
        :tracks="tracks" 
        :languages="languages" 
        fluid 
        class="video-player vjs-big-play-centered"
        @ready="onPlayerReady"
        @loadstart="onLoadStart"
        @canplay="onCanPlay"
        @error="onPlayerError"
      />
    </div>
  </div>
</template>

<script setup>
import en from "video.js/dist/lang/en.json";
import fr from "video.js/dist/lang/fr.json";
import { computed, onMounted, ref, watch, nextTick } from "vue";
import { translatePlugin, refreshTranslateBtn } from "../utils/videojsPlugins";
import { useI18n } from "../i18n/index.js";
import videojs from "video.js";

const { t, locale } = useI18n();
const props = defineProps(["value", "track"]);

// State management
const playerReady = ref(false);
const renderPlayer = ref(true);
const isLoading = ref(false);
const playerInstance = ref(null);
const lastSrc = ref("");
let playerInitialized = false;

// Computed properties with memoization
const currentSrc = computed(() => props.value || "");

const tracks = computed(() => {
  return (
    (props.track && [
      {
        src: props.track,
        srclang: "en",
        label: "default",
        mode: "showing",
      },
    ]) ||
    undefined
  );
});

const languages = ref({
  en: en,
  fr: fr,
});

// Player ready handler
function onPlayerReady(player) {
  playerInstance.value = player;
  playerReady.value = true;
  isLoading.value = false;
  
  // Register plugin once
  if (!playerInitialized) {
    videojs.registerPlugin("translatePlugin", translatePlugin);
    player.translatePlugin();
    playerInitialized = true;
    
    // Set initial language
    player.language(locale.value === "fr" ? "fr" : "en");
  }
}

function onLoadStart() {
  isLoading.value = true;
}

function onCanPlay() {
  isLoading.value = false;
}

function onPlayerError(error) {
  console.error("[v0] Player error:", error);
  isLoading.value = false;
}

// Optimize source changes with debouncing
let sourceChangeTimeout;
function updatePlayerSource(newValue) {
  if (!newValue || lastSrc.value === newValue || !playerInstance.value) {
    return;
  }

  clearTimeout(sourceChangeTimeout);
  sourceChangeTimeout = setTimeout(() => {
    try {
      const player = playerInstance.value;
      if (player && newValue) {
        // Prepare source for optimal streaming
        player.src({ 
          src: newValue, 
          type: "application/x-mpegURL",
          withCredentials: false 
        });
        
        // Don't auto-play on source change to reduce flash
        lastSrc.value = newValue;
      }
    } catch (error) {
      console.error("[v0] Failed to update source:", error);
    }
  }, 300); // Debounce source changes
}

// Watch source changes
watch(() => props.value, (newValue) => {
  if (newValue) {
    isLoading.value = true;
    updatePlayerSource(newValue);
  }
}, { immediate: true });

// Watch language changes
watch(locale, (newLocale) => {
  if (playerInstance.value) {
    playerInstance.value.language(newLocale === "fr" ? "fr" : "en");
  }
});

// Watch track changes
watch(tracks, () => {
  if (playerInstance.value) {
    refreshTranslateBtn(playerInstance.value, t("translateBtn"));
  }
});

// Lifecycle hooks
onMounted(async () => {
  // Wait for next tick to ensure DOM is ready
  await nextTick();
  
  // Initialize player from Video.js registry
  const players = videojs.getAllPlayers();
  if (players && players.length > 0) {
    onPlayerReady(players[0]);
  }
  
  // Set initial loading state
  isLoading.value = false;
});

// Cleanup on unmount
const unsubscribe = watch(
  () => props.value,
  () => {
    // Cleanup will happen on component unmount
  }
);
</script>

<style scoped lang="less">
.player-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #000;
  overflow: hidden;
}

.player-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  :deep(.video-player) {
    max-width: 100%;
    max-height: 100%;
  }
}

// Skeleton Loader for smooth transitions
.skeleton-loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  z-index: 10;
  animation: fadeOut 0.3s ease-out 0.5s forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    pointer-events: none;
  }
}

.skeleton-player {
  flex: 1;
  background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-controls {
  height: 50px;
  background: #1a1a1a;
  border-top: 1px solid #333;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 10px;

  &::before,
  &::after {
    content: '';
    height: 8px;
    background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
  }

  &::before {
    flex: 1;
    border-radius: 4px;
  }

  &::after {
    width: 50px;
    border-radius: 4px;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

// Performance: Use will-change sparingly
.player-wrapper {
  will-change: transform;
}
</style>
