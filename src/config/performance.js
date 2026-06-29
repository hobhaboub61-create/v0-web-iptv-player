/**
 * Performance Optimization Configuration
 * Optimizes video player, loading, caching, and rendering
 */

// Cache Configuration
export const CACHE_CONFIG = {
  // Playlist cache TTL (1 hour)
  PLAYLIST_TTL: 3600000,
  // Maximum number of playlists to cache in memory
  MAX_CACHE_SIZE: 10,
  // Enable localStorage caching for playlists
  USE_LOCALSTORAGE: true,
  // localStorage prefix
  STORAGE_PREFIX: 'iptv_cache_'
};

// Player Configuration
export const PLAYER_CONFIG = {
  // Enable adaptive bitrate streaming
  ADAPTIVE_BITRATE: true,
  // Preload strategy: 'none', 'metadata', 'auto'
  PRELOAD: 'metadata',
  // Buffer duration in seconds
  BUFFER_SECONDS: 10,
  // Enable hardware acceleration
  HARDWARE_ACCELERATION: true,
  // Player tech priority
  TECH_ORDER: ['html5'],
  // Enable smooth transitions
  SMOOTH_TRANSITIONS: true,
  // Debounce source changes (ms)
  SOURCE_CHANGE_DEBOUNCE: 300,
  // Auto-play configuration
  AUTO_PLAY: false, // Prevent flash and improve UX
};

// Loading Configuration
export const LOADING_CONFIG = {
  // Skeleton loader display duration (ms)
  SKELETON_DISPLAY_TIME: 500,
  // Fade out animation duration (ms)
  FADE_OUT_DURATION: 300,
  // Show loading spinner timeout (ms)
  SPINNER_TIMEOUT: 3000,
};

// Network Configuration
export const NETWORK_CONFIG = {
  // Request timeout (ms)
  REQUEST_TIMEOUT: 15000,
  // Retry attempts for failed requests
  RETRY_ATTEMPTS: 3,
  // Retry backoff multiplier
  RETRY_BACKOFF: 1.5,
  // Parallel requests limit
  PARALLEL_REQUESTS: 2,
};

// Memory Management
export const MEMORY_CONFIG = {
  // Clear old cache entries on interval (ms)
  CLEANUP_INTERVAL: 1800000, // 30 minutes
  // Maximum memory usage before cleanup (MB)
  MAX_MEMORY_MB: 100,
  // Enable aggressive garbage collection
  AGGRESSIVE_GC: false,
};

// Rendering Configuration
export const RENDERING_CONFIG = {
  // Use requestAnimationFrame for smooth animations
  USE_RAF: true,
  // Batch DOM updates
  BATCH_UPDATES: true,
  // Enable CSS containment for better performance
  USE_CONTAINMENT: true,
  // Throttle scroll/resize events (ms)
  THROTTLE_EVENTS: 100,
};

// Streaming Configuration
export const STREAMING_CONFIG = {
  // HLS configuration
  HLS: {
    enableLowInitialPlaylist: true,
    maxPlaylistRetries: 5,
    timeoutSeconds: 10,
    maxFragLookaheadLength: 4,
  },
  // DASH configuration
  DASH: {
    lowLatencyMode: false,
    streaming: {
      bufferTimeDefault: 8,
      bufferTimeMax: 20,
    },
  },
};

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  // Track player events
  TRACK_EVENTS: true,
  // Track performance metrics
  TRACK_METRICS: true,
  // Report Web Vitals
  REPORT_WEB_VITALS: true,
  // Batch analytics requests
  BATCH_INTERVAL: 5000,
};

// Export all configurations
export default {
  CACHE_CONFIG,
  PLAYER_CONFIG,
  LOADING_CONFIG,
  NETWORK_CONFIG,
  MEMORY_CONFIG,
  RENDERING_CONFIG,
  STREAMING_CONFIG,
  ANALYTICS_CONFIG,
};
