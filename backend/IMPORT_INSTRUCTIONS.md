# PocketBase Schema Import Instructions

## Quick Setup (2 minutes)

### Step 1: Import Collections Schema
1. Open PocketBase Admin: http://localhost:8090/_/
2. Login with your superuser credentials
3. Go to **Settings** (gear icon) → **Import collections**
4. Upload the file: `backend/collections_schema.json`
5. Click **"Review"** then **"Import"**

This will create 3 collections:
- `strings` - Tennis string database
- `racquets` - User's tennis racquets  
- `string_jobs` - String job history

### Step 2: Verify Setup
1. Check that all 3 collections exist in the sidebar
2. Test API endpoint: http://localhost:8090/api/collections/strings/records

## What Gets Created

### Collections:
- **strings**: Public database, anyone can read, authenticated users can add
- **racquets**: Private to each user, full CRUD for own racquets only
- **string_jobs**: Private to each user, linked to their racquets

### API Security:
- Users can only see/modify their own racquets and string jobs
- String database is shared but write-protected to authenticated users
- Proper cascade deletion for data integrity

## Next Steps
After import:
1. Test authentication in React Native app
2. Create a racquet through the app
3. Add strings to the database
4. Add a string job to track string performance

## Troubleshooting
- If import fails, check PocketBase logs in terminal
- Make sure JSON file is valid (pre-validated)
- Collections will be created with proper relationships automatically
- Check PocketBase logs in terminal for any errors