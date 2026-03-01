<template>
  <div class="nav" :class="{ 'nav-open': isOpen }">
    <div class="nav-menu" @click="isOpen = true">
      <img class="logo" src="../assets/logo.svg" alt="Web TV" />
    </div>
    <div class="nav-list-warp" v-show="isOpen">
      <div class="nav-header">
        <span class="nav-title">{{ t('appTitle') }} <img v-if="currentCountryFlagUrl" class="country-indicator" :src="currentCountryFlagUrl" alt="" @error="(e) => e.target.style.display='none'" /></span>
        <div class="nav-header-actions">
          <button
            class="settings-btn"
            @click="$emit('openSettings')"
            :aria-label="t('settings')"
          >&#9881;</button>
          <button class="nav-close" @click="isOpen = false" aria-label="Close menu">&times;</button>
        </div>
      </div>
      <div class="nav-tabs">
        <a
          class="nav-tab"
          :class="{ 'nav-tab-active': mode === 'home' }"
          href="#/?mode=home"
          @click="$emit('switchMode', 'home')"
        >{{ t('tabHome') }}</a>
        <a
          class="nav-tab"
          :class="{ 'nav-tab-active': mode === 'iptv' }"
          href="#/?mode=iptv"
          @click="$emit('switchMode', 'iptv')"
        >{{ t('tabIptv') }}</a>
        <a
          class="nav-tab"
          :class="{ 'nav-tab-active': mode === 'radio' }"
          href="#/?mode=radio"
          @click="$emit('switchMode', 'radio')"
        >{{ t('tabRadio') }}</a>
      </div>
      <div class="nav-search" v-if="props.tvs.length > 20 || search">
        <input
          v-model="search"
          type="text"
          :placeholder="t('searchPlaceholder')"
          class="nav-search-input"
        />
      </div>
      <div class="nav-loading" v-if="loading">
        <span class="spinner"></span>
        <span>{{ t('loadingChannels') }}</span>
      </div>
      <template v-else>
        <div class="nav-channel-count" v-if="tvChannelCount > 0 && !search">
          {{ t('channelCount', { count: tvChannelCount }) }}
        </div>
        <div class="nav-no-results" v-if="search && filteredTvs.length === 0">
          {{ t('noResults') }}
        </div>
        <ul class="nav-list">
          <li class="sub-nav" v-for="i in filteredTvs" :key="i.url + i.name">
            <img
              v-if="i.meta && i.meta['tvg-logo']"
              :src="i.meta['tvg-logo']"
              class="tv-logo"
              loading="lazy"
              alt=""
            />
            <a
              v-if="i.isTv"
              :class="{ active: i.url == active }"
              :href="'#/?url=' + encodeURIComponent(i.url) + (i.caption ? '&caption=' + encodeURIComponent(i.caption) : '') + '&mode=' + mode"
              @click="setTitle(i.name)"
            >{{ i.name }}</a>
            <span v-else class="group-label">{{ i.name }}</span>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "../i18n/index.js";
import { getCountryInfo, getFlagUrl } from "../utils/geolocation.js";

const { t, toggleLocale } = useI18n();

const props = defineProps(["tvs", "active", "mode", "loading", "currentCountry"]);
defineEmits(["switchMode", "openSettings"]);

const isOpen = ref(false);
const search = ref("");

const currentCountryFlagUrl = computed(() => {
  if (!props.currentCountry) return "";
  return getFlagUrl(props.currentCountry);
});

const tvChannelCount = computed(() => {
  return props.tvs.filter((i) => i.isTv).length;
});

const filteredTvs = computed(() => {
  if (!search.value.trim()) return props.tvs;
  const q = search.value.toLowerCase();
  return props.tvs.filter(
    (i) => i.name && i.name.toLowerCase().includes(q)
  );
});

function setTitle(title) {
  document.title = title + t("titleSuffix");
}
</script>

<style scoped lang="less">
.nav {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  color: #fff;

  .nav-menu {
    width: 1.5rem;
    height: 1.5rem;
    padding: 1rem;
    margin: 1rem;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
      background: rgba(0, 0, 0, 0.7);
    }
    .logo {
      width: 1.5rem;
    }
  }

  .nav-list-warp {
    display: none;
    background: rgba(10, 10, 20, 0.92);
    backdrop-filter: blur(12px);
    padding: 0;
    border-radius: 0;
    width: 300px;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  &:not(.nav-open) {
    .nav-list-warp {
      display: none;
    }
  }

  &.nav-open {
    .nav-menu {
      display: none;
    }
    .nav-list-warp {
      display: flex;
    }
  }

  .nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.9rem 0.8rem 0.5rem 1.2rem;
    min-height: 2.4rem;

    .nav-title {
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      white-space: nowrap;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .country-indicator {
        height: 1rem;
        width: auto;
        border-radius: 2px;
        vertical-align: middle;
      }
    }

    .nav-header-actions {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      flex-shrink: 0;
    }

    .settings-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      font-size: 0.9rem;
      padding: 0.3rem 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      &:hover {
        background: #fd6a30;
        border-color: #fd6a30;
      }
    }

    .nav-close {
      background: none;
      border: none;
      color: #fff;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      line-height: 1;
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .nav-tabs {
    display: flex;
    gap: 0;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .nav-tab {
    flex: 1;
    text-align: center;
    padding: 0.4rem 0.3rem;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    white-space: nowrap;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .nav-tab-active {
    color: #fd6a30;
    border-bottom-color: #fd6a30;
  }

  .nav-search {
    padding: 0.6rem 1rem;
    .nav-search-input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.45rem 0.8rem;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
      font-size: 0.85rem;
      outline: none;
      &::placeholder {
        color: rgba(255, 255, 255, 0.35);
      }
      &:focus {
        border-color: #fd6a30;
      }
    }
  }

  .nav-channel-count {
    padding: 0.2rem 1.2rem 0.3rem;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.03em;
  }

  .nav-no-results {
    padding: 2rem 1.2rem;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.4);
    text-align: center;
  }

  .nav-loading {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 2rem 1.2rem;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
  }

  .spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-top-color: #fd6a30;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .active {
    color: #fd6a30;
  }

  .nav-list {
    margin: 0;
    padding: 0;
    list-style: none;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.15) transparent;
  }

  .sub-nav {
    padding: 0 1rem 0 1.2rem;
    height: 2.2rem;
    line-height: 2.2rem;
    display: flex;
    align-items: center;
    min-width: 0;
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    .tv-logo {
      max-width: 2.5rem;
      max-height: 1.6rem;
      margin-right: 0.8rem;
      border-radius: 3px;
      flex-shrink: 0;
    }
    a {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.88rem;
      min-width: 0;
    }
  }

  .group-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.35);
    padding-top: 0.5rem;
  }

  a {
    color: #fff;
    text-decoration: none;
  }
}

@media (max-width: 600px) {
  .nav .nav-list-warp {
    width: 100vw;
  }
}
</style>
