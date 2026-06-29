# Changelog

## [2.1.0] - 2026-06-30

### Ajouts
- ✨ Sources IPTV-ORG 2026 complètement intégrées et mises à jour
- ✨ Système de fallback automatique pour les sources IPTV
- ✨ Support des catégories IPTV (Entertainment, Music)
- ✨ Dashboard Analytics avec Supabase pour tracker les utilisateurs
- ✨ Bouton X dans la recherche pour effacer le texte
- ✨ Tracking automatique des sessions, géolocalisation et device fingerprint

### Améliorations
- 🎨 Interface redessinée avec palette argent/néon brillante
- 🎨 Remplacement de l'orange par du cyan néon (#00d9ff)
- 🎨 Animations fluides et transitions optimisées
- 🔧 Préservation de la lecture lors du changement d'onglets (HOME → IPTV → RADIO)
- 🔧 Amélioration du système de cache des playlists
- 🔧 Meilleure gestion des erreurs avec messages localisés

### Corrections de Bugs
- 🐛 Correction du problème de coupure de vidéo lors du changement d'onglet
- 🐛 Amélioration de la stabilité du lecteur lors des changements de pays
- 🐛 Gestion améliorée des chaînes vides ou corrompues

### Sécurité
- 🔒 Row Level Security (RLS) activé dans Supabase
- 🔒 Données utilisateur anonymisées et chiffrées
- 🔒 Validation des URLs de playlist

### Dépendances
- `@supabase/supabase-js@^2.38.0` - Intégration Supabase

## [2.0.0] - 2026-06-15

### Ajouts
- ✨ Intégration complète Supabase pour le tracking
- ✨ Dashboard Analytics interactif
- ✨ Collecte IP, géolocalisation et device fingerprint
- ✨ Suivi des sessions utilisateur et événements

### Améliorations
- 🎨 Refonte complète de l'interface utilisateur
- 🎨 Nouvelle palette de couleurs argent/néon
- 🔧 Système de configuration amélioré

## [1.0.0] - 2026-01-01

### Ajouts
- ✨ Lecteur IPTV/Radio Vue 3 + Vite
- ✨ Support multi-pays (FR, GB, DE, NL, PT, TN)
- ✨ Changement de pays via Settings
- ✨ Recherche de chaînes en temps réel
- ✨ Support des formats M3U et XSPF
- ✨ Mode HOME, FREE IPTV, FREE RADIO
