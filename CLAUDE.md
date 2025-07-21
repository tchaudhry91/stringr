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
# Install task runner first: https://taskfile.dev
cd stringr
task install       # Install all dependencies
task dev           # Start both frontend and backend
task dev:ui        # Start only React Native web server
task dev:backend   # Start only PocketBase server
```

**Legacy Commands (still work):**
```bash
cd stringr         # Frontend directory
npm start          # Start Expo dev server
npm run web        # Run in web browser
npm test           # Run Jest tests
```

**PocketBase Backend:**
```bash
cd backend
./pocketbase serve --dev --dir ~/.stringr  # Manual start
task backend:admin # Create admin user
```

**Git Workflow:**
- Use `npm` for package management
- Commit frequently at logical stopping points
- Push to remote after major milestones
- All PocketBase data stored in ~/.stringr (outside repo)

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
1. ✅ Project setup and foundation (COMPLETED)
2. ✅ Navigation and basic screens (COMPLETED)
3. ✅ PocketBase backend setup (COMPLETED)
4. 🔄 Database schema and API integration (IN PROGRESS)
5. 📱 Core CRUD functionality
6. 📸 Media/photo features
7. 🔊 Audio processing foundation

## Current Project Status

**✅ Completed (Phase 1-3):**
- React Native/Expo project with TypeScript
- 4-tab navigation: Racquets, String Jobs, Strings, Profile
- PocketBase v0.23.6 backend server setup
- Task-based development workflow (Taskfile.yml)
- Comprehensive gitignore and project structure
- Web testing available at http://localhost:8081
- PocketBase admin at http://localhost:8090/_/ (when running)

**🔄 Next Steps (Phase 4):**
- Design and create PocketBase collections schema
- Setup API client for React Native ↔ PocketBase communication
- Implement authentication flow
- Build CRUD screens for racquet management

**📋 Pending Features (Phase 5-7):**
- String job creation and history tracking
- Photo/image support for racquets
- Advanced filtering and search
- Sound-based tension analysis (future)

## Expo Router Concepts

- **File-based routing**: Similar to SvelteKit, files in `app/` become routes
- **Route groups**: `(tabs)` - parentheses don't affect URL structure
- **Layouts**: `_layout.tsx` files provide shared UI/logic
- **Stack vs Tabs**: Stack = push/pop navigation, Tabs = bottom navigation

## PocketBase Backend Details

**Server Configuration:**
- Data directory: `~/.stringr/pb_data/`
- Admin interface: http://localhost:8090/_/
- API endpoint: http://localhost:8090/api/
- Development mode: Enabled with SQL logging

**Default Collections:**
- `users`: User authentication and profiles
- `_superusers`: Admin users
- System collections for auth, MFA, external auth

**Planned Tennis Collections:**
- `racquets`: Brand, model, specifications, photos
- `strings`: String database with characteristics
- `string_jobs`: Jobs linking racquets to strings with tensions/dates