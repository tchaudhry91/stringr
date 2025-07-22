# Stringr - Tennis Stringer's Notebook

A comprehensive mobile app for tennis players and stringers to track racquets, string jobs, and string performance. Built with React Native/Expo and PocketBase backend.

## Features

- **Racquet Management**: Track multiple racquets with specifications (brand, model, string pattern, weight, notes)
- **String Database**: Comprehensive database of tennis strings with user-contributed expansion
- **String Job Creation**: Complete workflow for recording string installations with main/cross strings and tensions
- **Session Tracking**: Record playing sessions with duration, rating, and string breakage monitoring
- **Add New Strings**: Expand the database with custom strings including specifications and performance data
- **Professional Mobile UI**: Bottom action buttons and mobile-optimized design with dark mode support
- **Cross-Platform**: iOS, Android, and Web support via React Native/Expo with full mobile compatibility

## Technology Stack

- **Frontend**: React Native with Expo Router (file-based routing)
- **Backend**: PocketBase (SQLite-based backend-as-a-service)
- **Database**: 4 collections - racquets, strings, string_jobs, sessions
- **Development**: Task-based workflow with comprehensive TypeScript API client

## Quick Start

```bash
# Install Task runner (if needed)
# macOS: brew install go-task
# Linux: sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b /usr/local/bin

# Install dependencies
cd stringr
task install

# Start development servers
task dev          # Both frontend and backend
task dev:ui       # Frontend only (React Native)
task dev:backend  # Backend only (PocketBase)

# Access the app
# Web: http://localhost:8081
# PocketBase Admin: http://localhost:8090/_/
```

## Project Status

**✅ Completed (Phase 1-7):**
- Project setup with React Native/Expo and 4-tab navigation
- PocketBase backend with production-ready database schema
- TypeScript API client with full CRUD operations
- Tennis strings scraper for comprehensive string database (200+ strings)
- Complete authentication system with login/register screens
- Protected routes and user session management
- SharedStyles system for consistent UI patterns
- **Core CRUD functionality**: Racquets management with add/edit/delete
- **Complete String Job Workflow**: Create string jobs linked to racquets with main/cross string selection
- **String Picker Modal**: Searchable interface for string selection from comprehensive database
- **Session Tracking**: Record playing sessions with duration, rating, and string breakage tracking
- **Add New Strings**: User-contributed database expansion with schema-compliant forms
- **Professional Mobile UI**: Bottom action buttons (Edit/String/Play/Delete) optimized for mobile
- **Cross-platform support**: Web browser and mobile compatibility via Expo Go
- **Schema Compliance**: All forms match PocketBase backend exactly for guaranteed data integrity
- **Complete User Workflow**: Racquet → String Job → Playing Session with full data relationships

**🔄 Next Steps (Phase 8-9):**
- String Job editing functionality with tension/string updates
- Photo support for racquet documentation
- Advanced data visualization and performance analytics
- Enhanced filtering and sorting capabilities
- Sound-based tension analysis (future research)

## Database Collections

- **racquets**: User's tennis racquets (name, brand, model, pattern, weight, notes)
- **strings**: Shared string database (brand, model, material, gauge, color, performance data)
- **string_jobs**: String installations (racquet, main/cross strings, tensions)
- **sessions**: Playing sessions with performance ratings and string breakage tracking

## Scripts

- **String Database Scraper**: `scripts/scrape_strings.py` - Scrapes Tennis Warehouse database to populate string collection with performance data

## Available Commands

```bash
# Development
task dev          # Start both frontend and backend
task dev:ui       # Start React Native web server
task dev:backend  # Start PocketBase backend server

# Setup
task install      # Install all dependencies
task setup        # Complete initial project setup

# Building
task build        # Build the application
task build:ui     # Build React Native application

# Maintenance
task clean        # Clean all build artifacts
task clean:ui     # Clean React Native artifacts
task clean:backend # Clean PocketBase data (WARNING: deletes data)

# Backend Management
task backend:admin    # Create PocketBase admin user
task backend:migrate  # Run PocketBase migrations
```

## Development

See [CLAUDE.md](CLAUDE.md) for detailed development instructions and project architecture.
