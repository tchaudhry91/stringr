# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"stringr" - A Tennis Stringer's Notebook mobile app built with React Native/Expo and PocketBase backend. Allows tennis players and stringers to track racquets, string jobs, and string characteristics. Future features include sound-based tension analysis.

## Repository Structure

```
├── README.md              # Project description
├── LICENSE                # Apache 2.0 license
├── CLAUDE.md              # This file
└── stringr/               # React Native/Expo app
    ├── app/               # File-based routing (like SvelteKit routes)
    │   ├── _layout.tsx    # Root layout with theme/fonts
    │   ├── (tabs)/        # Tab navigation group
    │   └── modal.tsx      # Modal screens
    ├── components/        # Reusable UI components
    ├── constants/         # App-wide constants (Colors, themes)
    ├── assets/           # Static assets (images, fonts)
    ├── app.json          # Expo configuration
    └── package.json      # Dependencies and scripts
```

## Development Commands

**Project Setup:**
```bash
cd stringr
npm start          # Start Expo dev server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator
npm run web        # Run in web browser
npm test           # Run Jest tests
```

**Git Workflow:**
- Use `bun` instead of `npm` for package management where possible
- Commit frequently at logical stopping points
- Push to remote after major milestones

## Technology Stack

- **Frontend**: React Native with Expo Router
- **Backend**: PocketBase (SQLite-based BaaS)
- **Database**: SQLite via PocketBase
- **Navigation**: File-based routing with tabs
- **Theming**: Built-in light/dark mode support
- **Testing**: Jest with React Native Testing Library

## Architecture Notes

**App Structure:**
- Tab-based navigation: Racquets, String Jobs, Strings, Profile
- Modal overlays for forms and detailed views
- Theme-aware components with automatic dark mode

**Data Models (Planned):**
- Users (authentication)
- Racquets (brand, model, specs, photos)
- Strings (brand, model, material, characteristics)
- StringJobs (racquet_id, string_id, tensions, date, notes)

**Development Phases:**
1. ✅ Project setup and foundation
2. 🔄 Navigation and basic screens
3. 📋 PocketBase backend setup
4. 📱 Core CRUD functionality
5. 📸 Media/photo features
6. 🔊 Audio processing foundation

## Expo Router Concepts

- **File-based routing**: Similar to SvelteKit, files in `app/` become routes
- **Route groups**: `(tabs)` - parentheses don't affect URL structure
- **Layouts**: `_layout.tsx` files provide shared UI/logic
- **Stack vs Tabs**: Stack = push/pop navigation, Tabs = bottom navigation