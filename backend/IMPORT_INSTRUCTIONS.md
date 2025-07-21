# PocketBase Collections Import

## Quick Import (30 seconds)

1. **Access PocketBase Admin**: http://localhost:8090/_/
2. **Go to Settings** → **Import collections**
3. **Select file**: `backend/stringr_schemas.json`
4. **Click "Review"** then **"Import"**

## What Gets Imported

### Collections Created:
- **`strings`**: Tennis string database (brand, model, material, gauge, color)
- **`racquets`**: User's tennis racquets (name, brand, model, pattern, weight, notes)
- **`string_jobs`**: String jobs with tensions (main/cross tension in lbs)
- **`sessions`**: Playing sessions with ratings and performance tracking

### Security Rules:
- User-scoped access: Users can only see their own racquets, string jobs, and sessions
- Strings are shared: Any authenticated user can view/add strings
- Proper API rules already configured

## Verification

After import, verify:
1. All 4 collections appear in Collections sidebar
2. Test API endpoints:
   - http://localhost:8090/api/collections/strings/records
   - http://localhost:8090/api/collections/racquets/records

## Next Steps

1. Create a test user account
2. Add some sample strings to the database
3. Create a racquet and string job to test the workflow
4. Start using the React Native app with the API client

## Schema Details

**Key Field Changes from Original Design:**
- **Racquets**: `name` is required, `pattern` instead of `string_pattern`, `weight` as text
- **String Jobs**: Simplified to `tension_lbs_main` and `tension_lbs_cross`
- **Sessions**: New collection for tracking playing sessions with performance data
- **Strings**: `model` is required, includes `user` field for tracking who added strings