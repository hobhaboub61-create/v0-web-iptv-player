/**
 * URL Shortener Service
 * Converts long playlist URLs into short shareable links
 */

// Generate a short code from a configuration
function generateShortCode(config) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${timestamp}${random}`;
}

// Encode a configuration object into a short URL
export function encodeConfig(config) {
  const code = generateShortCode(config);
  const stored = localStorage.getItem('urlMappings');
  const mappings = stored ? JSON.parse(stored) : {};
  
  mappings[code] = {
    url: config.url,
    caption: config.caption,
    mode: config.mode || 'home',
    created: new Date().toISOString()
  };
  
  localStorage.setItem('urlMappings', JSON.stringify(mappings));
  return code;
}

// Decode a short code back to configuration
export function decodeConfig(code) {
  const stored = localStorage.getItem('urlMappings');
  const mappings = stored ? JSON.parse(stored) : {};
  return mappings[code] || null;
}

// Create a short shareable link
export function createShortLink(url, caption = '', mode = 'home') {
  const config = { url, caption, mode };
  const code = encodeConfig(config);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#/s/${code}`;
}

// Parse short link format
export function parseShortLink(hash) {
  const match = hash.match(/#\/s\/([a-z0-9]+)/);
  if (match && match[1]) {
    return decodeConfig(match[1]);
  }
  return null;
}

// Clean up old mappings (older than 30 days)
export function cleanupOldMappings() {
  const stored = localStorage.getItem('urlMappings');
  if (!stored) return;
  
  const mappings = JSON.parse(stored);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  
  const cleaned = Object.entries(mappings).reduce((acc, [code, config]) => {
    if (config.created && config.created > thirtyDaysAgo) {
      acc[code] = config;
    }
    return acc;
  }, {});
  
  localStorage.setItem('urlMappings', JSON.stringify(cleaned));
}

// Get statistics about stored mappings
export function getMappingsStats() {
  const stored = localStorage.getItem('urlMappings');
  const mappings = stored ? JSON.parse(stored) : {};
  return {
    total: Object.keys(mappings).length,
    size: new Blob([stored || '{}']).size
  };
}
