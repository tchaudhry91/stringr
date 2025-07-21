# Tennis Stringer Database Schema

## Collections Overview

### 1. `racquets` Collection
Stores individual tennis racquets owned by users.

**Fields:**
- `id` (text, auto, primary key)
- `user` (relation to users collection)
- `brand` (text, required) - e.g., "Wilson", "Babolat", "Head"
- `model` (text, required) - e.g., "Pro Staff 97", "Pure Drive"
- `year` (number, optional) - Model year
- `grip_size` (text, optional) - e.g., "4 1/4", "4 3/8"
- `string_pattern` (text, optional) - e.g., "16x19", "18x20"
- `weight_unstrung` (number, optional) - Weight in grams
- `weight_strung` (number, optional) - Weight in grams when strung
- `balance_point` (number, optional) - Balance point in cm
- `swing_weight` (number, optional) - Swing weight
- `photo` (file, optional) - Photo of the racquet
- `notes` (text, optional) - Personal notes about the racquet
- `is_active` (bool, default: true) - Whether racquet is still in use
- `created` (date, auto)
- `updated` (date, auto)

### 2. `strings` Collection
Database of available tennis strings with their characteristics.

**Fields:**
- `id` (text, auto, primary key)
- `brand` (text, required) - e.g., "Luxilon", "Solinco", "Babolat"
- `model` (text, required) - e.g., "ALU Power", "Hyper G", "RPM Blast"
- `material` (select, required) - Options: "Polyester", "Natural Gut", "Synthetic Gut", "Multifilament", "Hybrid"
- `gauge` (text, optional) - e.g., "1.25mm", "16", "17"
- `color` (text, optional) - String color
- `characteristics` (json, optional) - JSON object with power, control, spin, comfort ratings
- `price_per_set` (number, optional) - Price per string set
- `notes` (text, optional) - String characteristics and notes
- `created` (date, auto)
- `updated` (date, auto)

### 3. `string_jobs` Collection
Records of string jobs performed on racquets.

**Fields:**
- `id` (text, auto, primary key)
- `user` (relation to users collection)
- `racquet` (relation to racquets collection)
- `main_string` (relation to strings collection) - Main string used
- `cross_string` (relation to strings collection, optional) - Cross string (for hybrid)
- `main_tension` (number, required) - Main string tension in lbs/kg
- `cross_tension` (number, optional) - Cross string tension (usually same as main)
- `tension_unit` (select, default: "lbs") - Options: "lbs", "kg"
- `stringer_name` (text, optional) - Who did the stringing
- `string_date` (date, required) - When the racquet was strung
- `string_cost` (number, optional) - Cost of the string job
- `pre_stretch` (bool, default: false) - Whether strings were pre-stretched
- `notes` (text, optional) - Notes about the string job
- `performance_rating` (number, optional) - 1-5 rating of how the strings felt
- `durability_hours` (number, optional) - How many hours strings lasted
- `broke_at` (text, optional) - Where strings broke (if applicable)
- `created` (date, auto)
- `updated` (date, auto)

## Relationships

1. **User → Racquets**: One-to-many (user can own multiple racquets)
2. **User → String Jobs**: One-to-many (user can have multiple string jobs)
3. **Racquet → String Jobs**: One-to-many (racquet can have multiple string jobs over time)
4. **String → String Jobs**: One-to-many (string type can be used in multiple jobs)

## API Rules (to be configured)

### `racquets`
- **List Rule**: `user = @request.auth.id` (users can only see their own racquets)
- **View Rule**: `user = @request.auth.id`
- **Create Rule**: `user = @request.auth.id`
- **Update Rule**: `user = @request.auth.id`
- **Delete Rule**: `user = @request.auth.id`

### `strings`
- **List Rule**: `""` (public, anyone can view string database)
- **View Rule**: `""`
- **Create Rule**: `@request.auth.id != ""` (authenticated users can add strings)
- **Update Rule**: `@request.auth.id != ""`
- **Delete Rule**: `@request.auth.id != ""`

### `string_jobs`
- **List Rule**: `user = @request.auth.id`
- **View Rule**: `user = @request.auth.id`
- **Create Rule**: `user = @request.auth.id && racquet.user = @request.auth.id`
- **Update Rule**: `user = @request.auth.id`
- **Delete Rule**: `user = @request.auth.id`

## Sample Data

### Racquets
```json
{
  "user": "user123",
  "brand": "Wilson",
  "model": "Pro Staff 97 v13",
  "year": 2023,
  "grip_size": "4 1/4",
  "string_pattern": "16x19",
  "weight_unstrung": 315,
  "notes": "My main racquet for matches"
}
```

### Strings
```json
{
  "brand": "Luxilon",
  "model": "ALU Power",
  "material": "Polyester",
  "gauge": "1.25mm",
  "color": "Silver",
  "characteristics": {
    "power": 6,
    "control": 9,
    "spin": 8,
    "comfort": 4,
    "durability": 9
  }
}
```

### String Jobs
```json
{
  "user": "user123",
  "racquet": "racquet456",
  "main_string": "string789",
  "main_tension": 52,
  "tension_unit": "lbs",
  "string_date": "2025-01-15",
  "notes": "Feels great for topspin shots"
}
```