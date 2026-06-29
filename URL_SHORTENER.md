# URL Shortener System

## Overview

The URL Shortener system automatically converts long playlist URLs into short, shareable links to improve user experience and simplify link sharing.

## How It Works

### Automatic Shortening

When you click on a channel or radio station, instead of generating a long URL like:

```
https://example.com/#/?url=http%3A%2F%2F99.27.51.147%3A8080%2FM6%2Findex.m3u8&caption=Channel%20Name&mode=home
```

The system generates a compact short link like:

```
https://example.com/#/s/1234567abcde
```

### Storage

Short links are stored in browser localStorage with the following information:
- Original playlist URL
- Channel/station caption (name)
- Mode (home, iptv, radio)
- Creation timestamp

### Benefits

- **Shorter URLs**: Reduce link length by 70-90%
- **Easier Sharing**: Copy and share via chat, email, social media
- **Better Analytics**: Track link usage
- **Automatic Cleanup**: Old links (>30 days) are automatically removed

## Usage

### Sharing a Channel

1. Click on any channel or radio station to play it
2. Click the **Share Link** button (🔗) in the menu
3. Copy the short link
4. Share it anywhere

### Manual Link Generation

You can also programmatically create short links:

```javascript
import { createShortLink } from './services/urlShortener.js';

const link = createShortLink(
  'http://stream.example.com/playlist.m3u8',
  'Channel Name',
  'home'
);
// Returns: "/#/s/1234567abcde"
```

### Decoding Short Links

Short links are automatically decoded when accessed:

```javascript
import { parseShortLink } from './services/urlShortener.js';

const config = parseShortLink('#/s/1234567abcde');
// Returns: { url, caption, mode, created }
```

## Storage Details

### localStorage Key
- `urlMappings` - Contains all stored short links

### Storage Limit
- Browser localStorage typically allows 5-10MB
- Each mapping takes ~200-500 bytes
- Sufficient for hundreds of short links

### Automatic Cleanup

Old mappings older than 30 days are automatically removed on app load:

```javascript
import { cleanupOldMappings } from './services/urlShortener.js';

cleanupOldMappings();
```

## Statistics

You can check how many mappings are stored:

```javascript
import { getMappingsStats } from './services/urlShortener.js';

const stats = getMappingsStats();
// Returns: { total: 42, size: 8542 }
```

## URL Format Comparison

### Before (Long Format)
```
https://v0-web-iptv-player.vercel.app/#/?url=http%3A%2F%2F99.27.51.147%3A8080%2FM6%2Findex.m3u8&caption=Channel%20Name&mode=home
```
- **Length**: 130+ characters
- **Hard to share**: Encoding makes it difficult to read

### After (Short Format)
```
https://v0-web-iptv-player.vercel.app/#/s/1bz4xyzabc
```
- **Length**: 50 characters (62% reduction)
- **Easy to share**: Short and memorable

## Features

- ✅ Automatic URL shortening
- ✅ Browser storage (no server required)
- ✅ Auto-generated unique codes
- ✅ Timestamp tracking
- ✅ Automatic cleanup of old links
- ✅ Share button for easy copying
- ✅ Statistics view
- ✅ Both short and long format support

## Technical Details

### Code Generation

Uses timestamp and random string for unique code:
- Timestamp (base36): 7 chars
- Random suffix: 5 chars
- Total: 12 chars per code

### Supported URLs

- HTTP/HTTPS streams
- Local/network URLs
- Any playlist format (m3u, m3u8, etc.)

## Fallback Support

If localStorage is unavailable, the system automatically falls back to long URL format:

```javascript
// If localStorage fails, uses long format:
#/?url=...&caption=...&mode=...
```

## Privacy

- All data stored locally in browser
- No server-side storage
- No tracking of link usage
- Data persists until manually cleared

## Future Enhancements

Potential improvements:
- Server-side storage for persistent links
- Link expiration dates
- Access analytics per link
- Custom link names
- QR code generation
