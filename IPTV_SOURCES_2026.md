# Sources IPTV Mises à Jour - 2026

## Dernières Sources IPTV Intégrées

Ce projet utilise maintenant les **dernières sources IPTV-ORG 2026** avec système de fallback pour une fiabilité maximale.

### Sources Principales

#### 1. **IPTV Global (Accueil)**
- **Primary**: `https://iptv-org.github.io/iptv/countries/{countryCode}.m3u`
- **Fallback**: `https://raw.githubusercontent.com/iptv-org/iptv/master/countries/{countryCode}.m3u`
- Chaînes TV locales par pays (FR, GB, DE, NL, PT, TN)

#### 2. **IPTV Gratuit (FREE IPTV)**
- **Primary**: `https://iptv-org.github.io/iptv/categories/entertainment.m3u`
- **Fallback**: `https://raw.githubusercontent.com/iptv-org/iptv/master/categories/entertainment.m3u`
- Chaînes de divertissement globales

#### 3. **Radios Gratuites (FREE RADIO)**
- **Primary**: `https://iptv-org.github.io/iptv/categories/music.m3u`
- **Fallback**: `https://raw.githubusercontent.com/iptv-org/iptv/master/categories/music.m3u`
- Stations radio mondiales

### Pays Supportés

| Code | Pays | Playlist |
|------|------|---------|
| FR | France | ✅ Actif |
| GB | United Kingdom | ✅ Actif |
| DE | Germany | ✅ Actif |
| NL | Netherlands | ✅ Actif |
| PT | Portugal | ✅ Actif |
| TN | Tunisia | ✅ Actif |

### Avantages du Système Actuel

- ✅ **Source Officielle IPTV-ORG** - Maintenue par la communauté
- ✅ **Fallback Automatique** - Bascule vers GitHub en cas d'indisponibilité
- ✅ **Mise à Jour Quotidienne** - Chaînes vérifiées régulièrement
- ✅ **Open Source** - Transparent et légal
- ✅ **Pas de Publicité** - Contenu pur
- ✅ **Cache Local** - Performance optimisée

### Autres Catégories Disponibles

Si vous souhaitez ajouter d'autres catégories, IPTV-ORG offre :

```
https://iptv-org.github.io/iptv/categories/sports.m3u         # Sports
https://iptv-org.github.io/iptv/categories/news.m3u           # Actualités
https://iptv-org.github.io/iptv/categories/kids.m3u           # Jeunesse
https://iptv-org.github.io/iptv/categories/documentary.m3u    # Documentaires
https://iptv-org.github.io/iptv/categories/series.m3u         # Séries TV
```

### Gestion des Erreurs

L'application inclut maintenant :
1. **Tentative Primary** - Essaye la source CDN principale
2. **Tentative Fallback** - Bascule vers GitHub si nécessaire
3. **Cache Local** - Utilise les données en mémoire si disponibles
4. **Messages d'Erreur** - Affiche un message clair en cas d'échec

### Mise à Jour des Sources

Pour mettre à jour les sources à l'avenir :

1. Modifiez `/src/App.vue` - constantes `IPTV_URL` et `RADIO_GLOBAL_URL`
2. Modifiez `/src/utils/geolocation.js` - URLs dans `getPlaylistUrl()`
3. Testez avec un VPN si nécessaire (certains pays restrictifs)

### Ressources

- **IPTV-ORG GitHub**: https://github.com/iptv-org/iptv
- **Site Official**: https://iptv-org.github.io/iptv/
- **Listes Vérifiées**: https://iptv-org.github.io/iptv/
- **API IPTV-ORG**: https://github.com/iptv-org/iptv-api

### Notes de Sécurité

- ✅ Toutes les sources proviennent de **IPTV-ORG** (projet open-source)
- ✅ Pas de logiciels malveillants ou publicités intrusives
- ✅ Recommandé d'utiliser un **VPN** pour la confidentialité
- ✅ Conforme à la réglementation IPTV standard

---

**Dernière mise à jour**: 30/06/2026
