<template>
  <div v-if="isOpen" class="share-overlay">
    <div class="share-modal">
      <div class="share-header">
        <h2 class="share-title">Share Link</h2>
        <button class="share-close" @click="$emit('close')">&times;</button>
      </div>
      <div class="share-content">
        <p class="share-description">{{ t('shareLinkDescription') || 'Copy this short link to share with others:' }}</p>
        <div class="share-input-group">
          <input 
            ref="linkInput"
            type="text" 
            :value="shortLink" 
            readonly 
            class="share-input"
          />
          <button class="share-copy-btn" @click="copyToClipboard">
            {{ copied ? t('copied') || 'Copied!' : t('copy') || 'Copy' }}
          </button>
        </div>
        <div class="share-stats">
          <p class="stat-item">
            <span class="stat-label">Original:</span>
            <span class="stat-value">{{ originalLength }} characters</span>
          </p>
          <p class="stat-item">
            <span class="stat-label">Shortened:</span>
            <span class="stat-value">{{ shortLink.length }} characters</span>
          </p>
          <p class="stat-item">
            <span class="stat-label">Reduction:</span>
            <span class="stat-value">{{ reduction }}%</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from '../i18n/index.js';
import { createFullShareLink } from '../services/urlShortener.js';

const { t } = useI18n();

const props = defineProps({
  isOpen: Boolean,
  url: String,
  caption: String,
  mode: {
    type: String,
    default: 'home'
  }
});

const emit = defineEmits(['close']);

const linkInput = ref(null);
const copied = ref(false);

const shortLink = computed(() => {
  if (!props.url) return '';
  return createFullShareLink(props.url, props.caption, props.mode);
});

const originalLength = computed(() => {
  if (!props.url) return 0;
  const original = `#/?url=${encodeURIComponent(props.url)}${props.caption ? '&caption=' + encodeURIComponent(props.caption) : ''}&mode=${props.mode}`;
  return original.length;
});

const reduction = computed(() => {
  if (originalLength.value === 0) return 0;
  return Math.round((1 - shortLink.value.length / originalLength.value) * 100);
});

const copyToClipboard = async () => {
  try {
    const text = window.location.origin + window.location.pathname + shortLink.value;
    await navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>

<style scoped lang="less">
.share-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 250;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.share-modal {
  background: linear-gradient(135deg, rgba(10, 10, 20, 0.98) 0%, rgba(20, 15, 35, 0.95) 100%);
  border: 1px solid var(--border-color, rgba(0, 217, 255, 0.2));
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 217, 255, 0.1), 0 0 40px rgba(0, 0, 0, 0.8);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.share-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.8rem;
  border-bottom: 1px solid var(--border-light, rgba(255, 255, 255, 0.1));
}

.share-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary, #fff);
  letter-spacing: 0.02em;
  background: linear-gradient(135deg, var(--primary-neon, #00d9ff) 0%, var(--accent-silver, #e0e0e0) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.share-close {
  background: rgba(0, 217, 255, 0.1);
  border: 1px solid var(--border-color, rgba(0, 217, 255, 0.2));
  color: var(--primary-neon, #00d9ff);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s;
  font-weight: 300;
  
  &:hover {
    background: var(--primary-neon, #00d9ff);
    color: var(--bg-darker, #05050f);
    transform: scale(1.1) rotate(90deg);
  }
}

.share-content {
  padding: 2rem;
}

.share-description {
  font-size: 0.9rem;
  color: var(--text-secondary, rgba(255, 255, 255, 0.7));
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.share-input-group {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 2rem;
}

.share-input {
  flex: 1;
  padding: 0.8rem;
  background: rgba(0, 217, 255, 0.05);
  border: 1px solid var(--border-light, rgba(255, 255, 255, 0.1));
  border-radius: 8px;
  color: var(--text-primary, #fff);
  font-size: 0.85rem;
  font-family: monospace;
  
  &:focus {
    outline: none;
    border-color: var(--primary-neon, #00d9ff);
    background: rgba(0, 217, 255, 0.1);
    box-shadow: 0 0 15px rgba(0, 217, 255, 0.2);
  }
}

.share-copy-btn {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-neon, #00d9ff) 0%, var(--primary-neon-dark, #00a8cc) 100%);
  border: none;
  border-radius: 8px;
  color: var(--bg-darker, #05050f);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  box-shadow: 0 8px 20px rgba(0, 217, 255, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0, 217, 255, 0.4);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(0, 217, 255, 0.25);
  }
}

.share-stats {
  background: rgba(0, 217, 255, 0.08);
  border: 1px solid var(--border-color, rgba(0, 217, 255, 0.2));
  border-radius: 8px;
  padding: 1.2rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.6rem 0;
  font-size: 0.85rem;
  
  &:first-child {
    margin-top: 0;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
}

.stat-label {
  color: var(--text-secondary, rgba(255, 255, 255, 0.7));
  font-weight: 600;
}

.stat-value {
  color: var(--primary-neon, #00d9ff);
  font-weight: 700;
  font-family: monospace;
}
</style>
