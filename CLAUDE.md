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

**Data Models (Implemented):**
- Users (authentication with name, email, avatar)
- Racquets (name, brand, model, pattern, weight, notes, year)
- Strings (brand, model, material, gauge, color, user attribution)
- String Jobs (racquet, main/cross strings, tension_lbs_main/cross)
- Sessions (string_job, duration_hours, rating, string_broken tracking)

**Development Phases:**
1. ✅ Project setup and foundation (COMPLETED)
2. ✅ Navigation and basic screens (COMPLETED)
3. ✅ PocketBase backend setup (COMPLETED)
4. ✅ Database schema and API integration (COMPLETED)
5. ✅ Authentication and user management (COMPLETED)
6. 🔄 Core CRUD functionality (IN PROGRESS)
7. 📸 Media/photo features
8. 🔊 Audio processing foundation

## Current Project Status

**✅ Completed (Phase 1-5):**
- React Native/Expo project with TypeScript and 4-tab navigation
- PocketBase v0.23.6 backend with production-ready database schema
- Complete API client with TypeScript interfaces for all collections
- Task-based development workflow (Taskfile.yml) with functional task runner
- 4 PocketBase collections: racquets, strings, string_jobs, sessions
- User-scoped security rules and proper data relationships
- Authentication system with login/register screens and protected routes
- SharedStyles system for consistent UI patterns across the app
- AuthContext for centralized user session and state management
- Web testing available at http://localhost:8081
- PocketBase admin at http://localhost:8090/_/ with schema import ready
- Tennis strings scraper script with comprehensive database (200+ strings)

**✅ Completed (Phase 5):**
- Authentication screens with login/register forms and validation
- AuthContext for centralized user session management  
- Protected routes that redirect to login when unauthenticated
- Profile screen with user info display and logout functionality
- Consistent authentication state management across navigation

**🔄 Current Phase (Phase 6):**
- Core CRUD functionality for racquets, string jobs, and sessions
- Data entry forms and list views for all tennis collections
- Integration with PocketBase API for full data persistence

**📋 Next Features (Phase 7-8):**
- Photo/image support for racquet documentation
- Advanced filtering, search, and data visualization
- Sound-based tension analysis (future research phase)

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

**System Collections:**
- `users`: User authentication with profiles (name, email, avatar)
- `_superusers`: Admin users for backend management
- System collections for auth, MFA, external auth, password resets

**Tennis Collections (Production Ready):**
- `racquets`: User's racquets (name required, brand, model, pattern, weight, notes)
- `strings`: Shared string database (model required, brand, material, gauge, color)
- `string_jobs`: String installations (racquet, main/cross strings, tensions in lbs)
- `sessions`: Performance tracking (duration, rating, string breakage per string job)

**Schema Import:**
- Complete schema available in `backend/stringr_schemas.json`
- 30-second import: Admin → Settings → Import collections
- Includes proper security rules and field constraints
- Ready for production use with user data isolation

## API Client Features

**TypeScript Integration (lib/pocketbase.ts):**
- Complete type definitions for all collections
- Authentication helpers (login, register, logout, session management)
- CRUD operations for racquets, strings, string_jobs, sessions
- Relationship expansion and filtering
- Search functionality for strings
- User-scoped data access

**Available API Functions:**
- `auth.login()`, `auth.register()`, `auth.getCurrentUser()`
- `api.racquets.list()`, `api.racquets.create()`, etc.
- `api.strings.search()`, `api.strings.list()`
- `api.stringJobs.getByRacquet()`, `api.stringJobs.create()`
- `api.sessions.getByStringJob()`, `api.sessions.create()`

## Scripts and Utilities

**String Database Scraper (`scripts/scrape_strings.py`):**
- Scrapes Tennis Warehouse comprehensive string database
- Extracts brand, model, material, gauge, and performance characteristics
- Generates timestamped JSON files for PocketBase import
- Over 200 tennis strings with detailed specifications
- Usage: `cd scripts && python3 scrape_strings.py`
- Dependencies: `pip install -r requirements.txt`