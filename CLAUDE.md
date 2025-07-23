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
6. ✅ Core CRUD functionality (COMPLETED)
7. ✅ String job creation and session tracking (COMPLETED)
8. ✅ Navigation restructure and racquet detail pages (COMPLETED)
9. 📸 Media/photo features
10. 🔊 Audio processing foundation

## Current Project Status

**✅ Completed (Phase 1-8):**
- React Native/Expo project with TypeScript and 3-tab navigation (Racquets, Strings, Profile)
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

**✅ Completed (Phase 6):**
- Complete CRUD functionality for racquets with add/edit/delete operations
- String Jobs tab with list view, tension display, and delete functionality
- Strings tab with comprehensive search and browse capabilities
- Cross-platform delete confirmations (web browser confirm, mobile Alert)
- Consistent SharedStyles system across all tabs and forms
- Auto-refresh functionality using useFocusEffect for data consistency
- Mobile-ready with IP-based PocketBase connection (192.168.1.5:8090)
- **Mobile-optimized UI**: Fixed card styling for proper text display and dark mode support
- **Bottom action buttons**: Clean card layout with Edit/String/Delete actions at bottom
- **Theme-aware design**: Proper light/dark mode support with themed components
- **Improved modal UX**: Removed default "modal" title for cleaner presentation

**✅ Completed (Phase 7):**
- **Complete String Job Workflow**: Create string jobs linked to specific racquets
- **String Picker Modal**: Searchable interface to select main/cross strings from database  
- **Session Tracking**: Record playing sessions with duration, rating, string breakage
- **Add New Strings**: User-contributed database expansion with schema-compliant forms
- **Professional Mobile UI**: Bottom action buttons (Edit/String/Play/Delete) optimized for mobile
- **Cross-Platform**: Works seamlessly on web browsers and mobile devices via Expo Go
- **Schema Compliance**: All forms match PocketBase backend exactly for guaranteed data integrity

**✅ Completed (Phase 8):**
- **Navigation Restructure**: Removed String Jobs tab - integrated into individual racquet detail pages
- **Racquet Detail Pages**: Click any racquet to see dedicated page with current state, string jobs history, and play sessions
- **Current State Display**: Shows racquet details and current string setup at top of detail page
- **String Jobs History**: Table showing all string jobs for the racquet with delete functionality
- **Play Sessions Tracking**: All sessions displayed with duration, rating, and string breakage info
- **Auto-refresh**: Pages automatically refresh when returning from modals (string jobs, sessions)
- **Clean Forms**: Removed confusing default placeholder values from all input fields
- **Improved Headers**: Fixed navigation titles showing proper "Racquet Details" instead of raw route names
- **Rating Display**: Simplified rating display without "/5" suffix for cleaner UI

**🐛 Recent Bug Fixes:**
- **✅ String Selection Bug**: Fixed form state management issues during string job creation by redesigning modal architecture
  - **Solution**: Replaced separate modal routes with internal view switching to prevent form state loss
  - **Files fixed**: `app/string-job-modal.tsx` (redesigned), `app/string-picker-modal.tsx` (removed)
  - **Improvements**: Proper navigation, no URL parameter chaos, maintains form state consistency
- **✅ Delete Functionality**: Fixed string job deletion not working in web browsers
  - **Solution**: Platform-specific confirmations (browser `confirm()` for web, React Native Alert for mobile)
  - **Files fixed**: `app/(tabs)/jobs.tsx`, `app/(tabs)/profile.tsx` (signout fix)
- **✅ Session Display**: Enhanced session creation to show both main and cross strings when available
  - **Files improved**: `app/session-modal.tsx` with intelligent string display logic

**🎨 UI/UX Improvements (Latest):**
- **✅ Card Styling Overhaul**: Improved mobile experience with better borders and contrast
  - **Thinner borders**: Reduced from 1px to 0.5px for cleaner appearance
  - **Better contrast**: Increased text opacity (0.7→0.8, 0.6→0.7) for improved readability
  - **Enhanced dark mode**: Better background colors (#1c1c1e) and theme-aware borders
  - **Mobile optimization**: Larger margins, touch targets, and spacing for mobile devices
  - **Files updated**: `styles/SharedStyles.ts`, all card-based screens
- **✅ Dark Mode Fixes**: Fixed racquet details card display issues in Expo Go
  - **Solution**: Added transparent backgrounds to inner View components for proper theme inheritance
  - **Files fixed**: `app/racquet/[id].tsx` with proper theme-aware styling
- **✅ Action Button Consistency**: Added missing buttons and standardized styling
  - **Added**: Edit/Delete buttons to racquet listing cards (were missing functionality)
  - **Fixed**: String jobs delete button styling to match other cards
  - **Consistent**: All cards now use identical button row styling and theming

**📋 Next Features (Phase 9-10):**
- String Job editing functionality with string/tension updates
- Photo/image support for racquet documentation
- Advanced data visualization and performance analytics
- Enhanced filtering, search, and sorting capabilities
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