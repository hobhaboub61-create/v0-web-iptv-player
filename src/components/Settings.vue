<template>
  <div class="settings-overlay" v-if="isOpen" @click.self="closeSettings">
    <div class="settings-modal">
      <div class="settings-header">
        <h2 class="settings-title">{{ t('settings') }}</h2>
        <button class="settings-close" @click="closeSettings" aria-label="Close settings">
          &times;
        </button>
      </div>

      <div class="settings-content">
        <div class="settings-section">
          <label class="settings-label">{{ t('selectCountry') }}</label>
          <div class="country-grid">
            <button
              v-for="(country, code) in countries"
              :key="code"
              class="country-btn"
              :class="{ 'country-btn-active': selectedCountry === code }"
              @click="selectCountry(code)"
            >
              <img
                class="country-flag"
                :src="getFlagUrl(code)"
                :alt="country.name"
                @error="(e) => e.target.style.display = 'none'"
              />
              <span class="country-code">{{ code }}</span>
              <span class="country-name">{{ country.name }}</span>
            </button>
          </div>
        </div>

        <div class="settings-section">
          <label class="settings-label">{{ t('language') }}</label>
          <div class="language-options">
            <button
              class="lang-option"
              :class="{ 'lang-option-active': locale === 'en' }"
              @click="changeLanguage('en')"
            >
              English
            </button>
            <button
              class="lang-option"
              :class="{ 'lang-option-active': locale === 'fr' }"
              @click="changeLanguage('fr')"
            >
              Français
            </button>
          </div>
        </div>

        <div class="info-section">
          <p class="settings-info">{{ t('settingsInfo') }}</p>
        </div>
      </div>

      <div class="settings-footer">
        <button class="btn-close" @click="closeSettings">{{ t('close') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "../i18n/index.js";
import {
  getSelectedCountry,
  setSelectedCountry,
  getSupportedCountries,
  getFlagUrl,
} from "../utils/geolocation.js";

const { t, locale, setLocale } = useI18n();

const props = defineProps(["isOpen"]);
const emit = defineEmits(["close", "countryChanged"]);

const countries = computed(() => getSupportedCountries());
const selectedCountry = ref(getSelectedCountry());

function selectCountry(code) {
  if (setSelectedCountry(code)) {
    selectedCountry.value = code;
    emit("countryChanged", code);
  }
}

function changeLanguage(lang) {
  setLocale(lang);
}

function closeSettings() {
  emit("close");
}
</script>

<style scoped lang="less">
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(4px);
}

.settings-modal {
  background: rgba(15, 15, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.settings-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.02em;
}

.settings-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.settings-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.settings-section {
  margin-bottom: 2rem;
  &:last-of-type {
    margin-bottom: 0;
  }
}

.settings-label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 1rem;
  letter-spacing: 0.01em;
}

.country-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.8rem;
}

.country-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s;
  gap: 0.4rem;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
  }

  &.country-btn-active {
    background: #fd6a30;
    border-color: #fd6a30;
    color: #fff;
  }
}

.country-flag {
  width: 2.5rem;
  height: auto;
  border-radius: 3px;
  object-fit: cover;
}

.country-code {
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.05em;
}

.country-name {
  font-size: 0.85rem;
  font-weight: 500;
}

.language-options {
  display: flex;
  gap: 0.8rem;
}

.lang-option {
  flex: 1;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
  }

  &.lang-option-active {
    background: #fd6a30;
    border-color: #fd6a30;
    color: #fff;
  }
}

.settings-info {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
  margin: 0;
}

.info-section {
  background: rgba(253, 106, 48, 0.1);
  border-left: 3px solid #fd6a30;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 0;
}

.settings-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.btn-close {
  width: 100%;
  padding: 0.8rem;
  background: #fd6a30;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #ff7a45;
  }

  &:active {
    background: #ed5a1f;
  }
}
</style>
