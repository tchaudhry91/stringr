# PocketBase Security Rules Setup

After importing the collections, you'll need to refine the API security rules for proper data isolation.

## Current Import Rules
The schema imports with basic authentication rules:
- `@request.auth.id != ""` - Only authenticated users can access

## Recommended Security Rules

### 1. `racquets` Collection Rules
After import, update these rules in PocketBase Admin → Collections → racquets → API Rules:

- **List Rule**: `user = @request.auth.id`
- **View Rule**: `user = @request.auth.id`
- **Create Rule**: `@request.auth.id != "" && @request.data.user = @request.auth.id`
- **Update Rule**: `user = @request.auth.id`
- **Delete Rule**: `user = @request.auth.id`

### 2. `string_jobs` Collection Rules
Update in Collections → string_jobs → API Rules:

- **List Rule**: `user = @request.auth.id`
- **View Rule**: `user = @request.auth.id`
- **Create Rule**: `@request.auth.id != "" && @request.data.user = @request.auth.id && @request.data.racquet.user = @request.auth.id`
- **Update Rule**: `user = @request.auth.id`
- **Delete Rule**: `user = @request.auth.id`

### 3. `strings` Collection Rules
These are good as imported:

- **List Rule**: `""` (public read access)
- **View Rule**: `""` (public read access)
- **Create Rule**: `@request.auth.id != ""` (authenticated users can add strings)
- **Update Rule**: `@request.auth.id != ""` (authenticated users can edit strings)
- **Delete Rule**: `@request.auth.id != ""` (authenticated users can delete strings)

## Why These Rules?

1. **User Isolation**: Each user can only see/modify their own racquets and string jobs
2. **Data Integrity**: String jobs can only be created for racquets owned by the same user
3. **Shared String Database**: All users can view the string database, authenticated users can contribute
4. **Security**: Prevents users from accessing other users' private data

## Testing Security
After updating rules, test with different user accounts:
1. Create 2 test users
2. Add racquets for each user
3. Verify User A cannot see User B's racquets
4. Verify string database is shared between users

## Auto-Applied Fields
PocketBase will automatically set the `user` field to `@request.auth.id` when creating records if properly configured in the client code.