# Manual PocketBase Collections Setup

Since the JSON import format is complex, let's create the collections manually. This takes about 5 minutes and ensures everything works correctly.

## 1. Create `strings` Collection

1. Go to **Collections** → **New Collection**
2. **Name**: `strings`
3. **Type**: Base collection
4. **Add these fields**:

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `brand` | Text | ✅ | Max: 100 |
| `model` | Text | ✅ | Max: 100 |
| `material` | Select | ✅ | Values: `Polyester`, `Natural Gut`, `Synthetic Gut`, `Multifilament`, `Hybrid` |
| `gauge` | Text | ❌ | Max: 20 |
| `color` | Text | ❌ | Max: 50 |
| `characteristics` | JSON | ❌ | |
| `price_per_set` | Number | ❌ | |
| `notes` | Text | ❌ | Max: 1000 |

5. **API Rules**:
   - List Rule: `""` (empty = public)
   - View Rule: `""` (empty = public)
   - Create Rule: `@request.auth.id != ""`
   - Update Rule: `@request.auth.id != ""`
   - Delete Rule: `@request.auth.id != ""`

## 2. Create `racquets` Collection

1. **New Collection** → **Name**: `racquets`
2. **Add these fields**:

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `user` | Relation | ✅ | Collection: `users`, Single select, Display: name, email |
| `brand` | Text | ✅ | Max: 100 |
| `model` | Text | ✅ | Max: 100 |
| `year` | Number | ❌ | Min: 1990, Max: 2030 |
| `grip_size` | Text | ❌ | Max: 20 |
| `string_pattern` | Text | ❌ | Max: 20 |
| `weight_unstrung` | Number | ❌ | Min: 200, Max: 400 |
| `weight_strung` | Number | ❌ | Min: 200, Max: 400 |
| `balance_point` | Number | ❌ | Min: 250, Max: 400 |
| `swing_weight` | Number | ❌ | Min: 250, Max: 400 |
| `photo` | File | ❌ | Max: 1 file, 5MB, Image types only |
| `notes` | Text | ❌ | Max: 2000 |
| `is_active` | Bool | ❌ | Default: true |

3. **API Rules** (start with basic auth, can be refined later):
   - List Rule: `@request.auth.id != ""`
   - View Rule: `@request.auth.id != ""`
   - Create Rule: `@request.auth.id != ""`
   - Update Rule: `@request.auth.id != ""`
   - Delete Rule: `@request.auth.id != ""`

## 3. Create `string_jobs` Collection

1. **New Collection** → **Name**: `string_jobs`
2. **Add these fields**:

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `user` | Relation | ✅ | Collection: `users`, Single select |
| `racquet` | Relation | ✅ | Collection: `racquets`, Single select, Display: brand, model |
| `main_string` | Relation | ✅ | Collection: `strings`, Single select, Display: brand, model |
| `cross_string` | Relation | ❌ | Collection: `strings`, Single select, Display: brand, model |
| `main_tension` | Number | ✅ | Min: 20, Max: 80 |
| `cross_tension` | Number | ❌ | Min: 20, Max: 80 |
| `tension_unit` | Select | ❌ | Values: `lbs`, `kg`, Default: `lbs` |
| `stringer_name` | Text | ❌ | Max: 100 |
| `string_date` | Date | ✅ | |
| `string_cost` | Number | ❌ | Min: 0 |
| `pre_stretch` | Bool | ❌ | Default: false |
| `notes` | Text | ❌ | Max: 2000 |
| `performance_rating` | Number | ❌ | Min: 1, Max: 5 |
| `durability_hours` | Number | ❌ | Min: 0 |
| `broke_at` | Text | ❌ | Max: 200 |

3. **API Rules**:
   - List Rule: `@request.auth.id != ""`
   - View Rule: `@request.auth.id != ""`
   - Create Rule: `@request.auth.id != ""`
   - Update Rule: `@request.auth.id != ""`
   - Delete Rule: `@request.auth.id != ""`

## 4. Test the Collections

1. Go to each collection and verify all fields are created
2. Test API endpoints:
   - http://localhost:8090/api/collections/strings/records
   - http://localhost:8090/api/collections/racquets/records
   - http://localhost:8090/api/collections/string_jobs/records

## 5. Optional: Improve Security Rules

After creating collections, follow `SECURITY_RULES.md` for better user isolation.

## Quick Field Reference

### Select Field Values:
- **Material**: Polyester, Natural Gut, Synthetic Gut, Multifilament, Hybrid
- **Tension Unit**: lbs, kg

### File Field Settings:
- **Photo**: Max 1 file, 5MB limit, Image types (jpeg, png, webp, gif, svg)
- **Thumbnails**: 100x100, 300x300

### Relation Settings:
- **User relations**: Single select, show name/email
- **String relations**: Single select, show brand/model
- **Racquet relations**: Single select, show brand/model