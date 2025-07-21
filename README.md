# Stringr - Tennis Stringer's Notebook

A comprehensive mobile app for tennis players and stringers to track racquets, string jobs, and string performance. Built with React Native/Expo and PocketBase backend.

## Features

- **Racquet Management**: Track multiple racquets with specifications (brand, model, string pattern, weight, notes)
- **String Database**: Comprehensive database of tennis strings with performance characteristics
- **String Job History**: Record string installations with main/cross strings and tension settings
- **Session Tracking**: Monitor string performance and longevity across playing sessions
- **Cross-Platform**: iOS, Android, and Web support via React Native/Expo

## Technology Stack

- **Frontend**: React Native with Expo Router (file-based routing)
- **Backend**: PocketBase (SQLite-based backend-as-a-service)
- **Database**: 4 collections - racquets, strings, string_jobs, sessions
- **Development**: Task-based workflow with comprehensive TypeScript API client

## Quick Start

```bash
# Install dependencies
cd stringr
npm install

# Start development servers
task dev          # Both frontend and backend
task dev:ui       # Frontend only (React Native)
task dev:backend  # Backend only (PocketBase)

# Access the app
# Web: http://localhost:8081
# PocketBase Admin: http://localhost:8090/_/
```

## Project Status

**✅ Completed:**
- Project setup with React Native/Expo and 4-tab navigation
- PocketBase backend with production-ready database schema
- TypeScript API client with full CRUD operations
- Tennis strings scraper for comprehensive string database (200+ strings)
- User authentication system and security rules

**🔄 Next Steps:**
- Authentication UI screens and user registration flow
- Core CRUD functionality for racquets and string jobs
- Photo support and advanced data visualization

## Database Collections

- **racquets**: User's tennis racquets (name, brand, model, pattern, weight, notes)
- **strings**: Shared string database (brand, model, material, gauge, color, performance data)
- **string_jobs**: String installations (racquet, main/cross strings, tensions)
- **sessions**: Playing sessions with performance ratings and string breakage tracking

## Scripts

- **String Database Scraper**: `scripts/scrape_strings.py` - Scrapes Tennis Warehouse database to populate string collection with performance data

## Development

See [CLAUDE.md](CLAUDE.md) for detailed development instructions and project architecture.
