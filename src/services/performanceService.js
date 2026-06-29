import { CACHE_CONFIG, MEMORY_CONFIG, RENDERING_CONFIG } from '../config/performance.js';

/**
 * Performance Monitoring and Optimization Service
 */
class PerformanceService {
  constructor() {
    this.metrics = {
      playerInitTime: 0,
      sourceChangeTime: 0,
      playlistLoadTime: 0,
    };
    this.cacheCleanupInterval = null;
    this.enabled = true;
  }

  /**
   * Start performance monitoring
   */
  startMonitoring() {
    if (!this.enabled) return;

    // Start cache cleanup interval
    this.cacheCleanupInterval = setInterval(() => {
      this.cleanupOldCacheEntries();
    }, MEMORY_CONFIG.CLEANUP_INTERVAL);

    // Monitor Web Vitals
    this.monitorWebVitals();

    console.log('[v0] Performance monitoring started');
  }

  /**
   * Monitor Web Vitals (LCP, FCP, CLS)
   */
  monitorWebVitals() {
    try {
      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('[v0] LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        const fid = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log('[v0] FID:', entry.processingDuration);
          }
        });
        fid.observe({ entryTypes: ['first-input'] });
      }
    } catch (error) {
      console.warn('[v0] Web Vitals monitoring not supported:', error);
    }
  }

  /**
   * Measure function execution time
   */
  measure(label, fn) {
    const start = performance.now();
    try {
      const result = fn();
      const end = performance.now();
      const duration = end - start;
      
      console.log(`[v0] ${label}: ${duration.toFixed(2)}ms`);
      this.metrics[label] = duration;
      
      return result;
    } catch (error) {
      console.error(`[v0] Error in ${label}:`, error);
      throw error;
    }
  }

  /**
   * Async measure
   */
  async measureAsync(label, fn) {
    const start = performance.now();
    try {
      const result = await fn();
      const end = performance.now();
      const duration = end - start;
      
      console.log(`[v0] ${label}: ${duration.toFixed(2)}ms`);
      this.metrics[label] = duration;
      
      return result;
    } catch (error) {
      console.error(`[v0] Error in ${label}:`, error);
      throw error;
    }
  }

  /**
   * Clean up old cache entries from localStorage
   */
  cleanupOldCacheEntries() {
    if (!CACHE_CONFIG.USE_LOCALSTORAGE) return;

    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();
      let cleaned = 0;

      for (const key of keys) {
        if (key.startsWith(CACHE_CONFIG.STORAGE_PREFIX)) {
          try {
            const item = JSON.parse(localStorage.getItem(key));
            if (now - item.timestamp > CACHE_CONFIG.PLAYLIST_TTL) {
              localStorage.removeItem(key);
              cleaned++;
            }
          } catch (e) {
            // Invalid cache entry, remove it
            localStorage.removeItem(key);
            cleaned++;
          }
        }
      }

      if (cleaned > 0) {
        console.log(`[v0] Cleaned up ${cleaned} old cache entries`);
      }
    } catch (error) {
      console.warn('[v0] Cache cleanup error:', error);
    }
  }

  /**
   * Get memory usage estimate
   */
  getMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory;
      return {
        usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
        jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
      };
    }
    return null;
  }

  /**
   * Log performance metrics
   */
  logMetrics() {
    console.group('[v0] Performance Metrics');
    console.table(this.metrics);
    
    const memory = this.getMemoryUsage();
    if (memory) {
      console.log('Memory Usage:', memory);
    }
    
    console.groupEnd();
  }

  /**
   * Enable/Disable performance monitoring
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled && this.cacheCleanupInterval) {
      clearInterval(this.cacheCleanupInterval);
    }
  }

  /**
   * Cleanup and stop monitoring
   */
  destroy() {
    if (this.cacheCleanupInterval) {
      clearInterval(this.cacheCleanupInterval);
    }
    this.enabled = false;
  }
}

export const performanceService = new PerformanceService();
export default performanceService;
