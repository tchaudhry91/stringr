# Tennis Stringer Database Schema

## Collections Overview

### 1. `racquets` Collection
Stores individual tennis racquets owned by users.

**Fields:**
- `id` (text, auto, primary key)
- `user` (relation to users collection, optional)
- `name` (text, required) - Display name for the racquet
- `brand` (text, optional) - e.g., "Wilson", "Babolat", "Head"
- `model` (text, optional) - e.g., "Pro Staff 97", "Pure Drive"
- `year` (number, optional) - Model year
- `pattern` (text, optional) - String pattern e.g., "16x19", "18x20"
- `weight` (text, optional) - Weight as text (flexible format)
- `notes` (text, optional) - Personal notes about the racquet
- `is_active` (bool, optional) - Whether racquet is still in use
- `created` (date, auto)
- `updated` (date, auto)

### 2. `strings` Collection
Database of available tennis strings.

**Fields:**
- `id` (text, auto, primary key)
- `brand` (text, optional) - e.g., "Luxilon", "Solinco", "Babolat"
- `model` (text, required) - e.g., "ALU Power", "Hyper G", "RPM Blast"
- `material` (text, optional) - e.g., "Polyester", "Natural Gut", "Multifilament"
- `gauge` (text, optional) - e.g., "1.25mm", "16", "17"
- `color` (text, optional) - String color
- `user` (relation to users collection, optional) - Who added this string
- `created` (date, auto)
- `updated` (date, auto)

### 3. `string_jobs` Collection
Records of string jobs performed on racquets.

**Fields:**
- `id` (text, auto, primary key)
- `user` (relation to users collection, optional)
- `racquet` (relation to racquets collection, optional)
- `main_string` (relation to strings collection, optional) - Main string used
- `cross_string` (relation to strings collection, optional) - Cross string for hybrid setups
- `tension_lbs_main` (number, optional) - Main string tension in lbs
- `tension_lbs_cross` (number, optional) - Cross string tension in lbs
- `created` (date, auto)
- `updated` (date, auto)

### 4. `sessions` Collection
Playing sessions to track string performance.

**Fields:**
- `id` (text, auto, primary key)
- `user` (relation to users collection, optional)
- `string_job` (relation to string_jobs collection, optional) - Which string job was used
- `duration_hours` (number, optional) - How long the session lasted
- `rating` (number, optional) - Performance rating for the strings
- `string_broken` (bool, optional) - Whether strings broke during session
- `created` (date, auto)
- `updated` (date, auto)

## Relationships

1. **User → Racquets**: One-to-many (user can own multiple racquets)
2. **User → String Jobs**: One-to-many (user can have multiple string jobs)
3. **User → Sessions**: One-to-many (user can have multiple playing sessions)
4. **Racquet → String Jobs**: One-to-many (racquet can have multiple string jobs over time)
5. **String Job → Sessions**: One-to-many (string job can have multiple sessions tracking its performance)
6. **String → String Jobs**: One-to-many (string type can be used in multiple jobs)
7. **User → Strings**: One-to-many (user can add strings to the shared database)

## API Rules (Configured)

### `racquets`
- **All Rules**: `@request.auth.id = user.id` (users can only access their own racquets)

### `strings`
- **All Rules**: `@request.auth.id != ""` (authenticated users can read/write shared string database)

### `string_jobs`
- **All Rules**: `@request.auth.id = user.id` (users can only access their own string jobs)

### `sessions`
- **All Rules**: `@request.auth.id = user.id` (users can only access their own sessions)

## Sample Data

### Racquets
```json
{
  "name": "My Pro Staff",
  "brand": "Wilson",
  "model": "Pro Staff 97 v13",
  "year": 2023,
  "pattern": "16x19",
  "weight": "315g unstrung",
  "notes": "My main match racquet"
}
```

### Strings
```json
{
  "brand": "Luxilon",
  "model": "ALU Power",
  "material": "Polyester",
  "gauge": "1.25mm",
  "color": "Silver"
}
```

### String Jobs
```json
{
  "racquet": "racquet_id",
  "main_string": "string_id",
  "tension_lbs_main": 52,
  "tension_lbs_cross": 50
}
```

### Sessions
```json
{
  "string_job": "string_job_id",
  "duration_hours": 2.5,
  "rating": 4,
  "string_broken": false
}
```