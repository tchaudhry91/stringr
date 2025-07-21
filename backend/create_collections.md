# PocketBase Collections Setup Guide

## Manual Setup Instructions

To create the tennis stringer collections, follow these steps in the PocketBase admin interface:

### 1. Start PocketBase Server
```bash
cd backend
./pocketbase serve --dev --dir ~/.stringr
```

### 2. Access Admin Interface
- Open http://localhost:8090/_/
- If no admin user exists, create one first:
  ```bash
  ./pocketbase superuser create --dir ~/.stringr
  ```

### 3. Create Collections

#### A. Create `strings` Collection
1. Go to Collections → New Collection
2. Name: `strings`
3. Type: Base
4. Add these fields:
   - `brand` (Text, Required, Max: 100)
   - `model` (Text, Required, Max: 100) 
   - `material` (Select, Required) Options: Polyester, Natural Gut, Synthetic Gut, Multifilament, Hybrid
   - `gauge` (Text, Optional, Max: 20)
   - `color` (Text, Optional, Max: 50)
   - `characteristics` (JSON, Optional)
   - `price_per_set` (Number, Optional)
   - `notes` (Text, Optional, Max: 1000)

5. Set API Rules:
   - List Rule: `""` (public)
   - View Rule: `""`
   - Create Rule: `@request.auth.id != ""`
   - Update Rule: `@request.auth.id != ""`
   - Delete Rule: `@request.auth.id != ""`

#### B. Create `racquets` Collection
1. Go to Collections → New Collection
2. Name: `racquets`
3. Type: Base
4. Add these fields:
   - `user` (Relation to users, Required, Single)
   - `brand` (Text, Required, Max: 100)
   - `model` (Text, Required, Max: 100)
   - `year` (Number, Optional)
   - `grip_size` (Text, Optional, Max: 20)
   - `string_pattern` (Text, Optional, Max: 20)
   - `weight_unstrung` (Number, Optional)
   - `weight_strung` (Number, Optional) 
   - `balance_point` (Number, Optional)
   - `swing_weight` (Number, Optional)
   - `photo` (File, Optional, Max: 1, Max Size: 5MB, Types: image/*)
   - `notes` (Text, Optional, Max: 2000)
   - `is_active` (Bool, Default: true)

5. Set API Rules:
   - List Rule: `user = @request.auth.id`
   - View Rule: `user = @request.auth.id`
   - Create Rule: `user = @request.auth.id`
   - Update Rule: `user = @request.auth.id`
   - Delete Rule: `user = @request.auth.id`

#### C. Create `string_jobs` Collection
1. Go to Collections → New Collection
2. Name: `string_jobs`
3. Type: Base
4. Add these fields:
   - `user` (Relation to users, Required, Single)
   - `racquet` (Relation to racquets, Required, Single)
   - `main_string` (Relation to strings, Required, Single)
   - `cross_string` (Relation to strings, Optional, Single)
   - `main_tension` (Number, Required)
   - `cross_tension` (Number, Optional)
   - `tension_unit` (Select, Default: "lbs") Options: lbs, kg
   - `stringer_name` (Text, Optional, Max: 100)
   - `string_date` (Date, Required)
   - `string_cost` (Number, Optional)
   - `pre_stretch` (Bool, Default: false)
   - `notes` (Text, Optional, Max: 2000)
   - `performance_rating` (Number, Optional, Min: 1, Max: 5)
   - `durability_hours` (Number, Optional)
   - `broke_at` (Text, Optional, Max: 200)

5. Set API Rules:
   - List Rule: `user = @request.auth.id`
   - View Rule: `user = @request.auth.id`
   - Create Rule: `user = @request.auth.id && racquet.user = @request.auth.id`
   - Update Rule: `user = @request.auth.id`
   - Delete Rule: `user = @request.auth.id`

## Sample Data to Add

### Sample Strings
Add these popular tennis strings:

1. **Luxilon ALU Power**
   - Brand: Luxilon
   - Model: ALU Power
   - Material: Polyester
   - Gauge: 1.25mm
   - Color: Silver
   - Characteristics: `{"power": 6, "control": 9, "spin": 8, "comfort": 4, "durability": 9}`

2. **Babolat RPM Blast**
   - Brand: Babolat
   - Model: RPM Blast
   - Material: Polyester
   - Gauge: 1.25mm
   - Color: Black
   - Characteristics: `{"power": 7, "control": 8, "spin": 9, "comfort": 5, "durability": 8}`

3. **Wilson Natural Gut**
   - Brand: Wilson
   - Model: Natural Gut
   - Material: Natural Gut
   - Gauge: 1.30mm
   - Color: Natural
   - Characteristics: `{"power": 9, "control": 7, "spin": 6, "comfort": 10, "durability": 6}`

## Verification
After creating collections, verify:
1. All three collections appear in the admin interface
2. Field types and constraints are correct
3. API rules are properly set
4. Sample string data has been added
5. Test API endpoints at http://localhost:8090/api/collections/

## Next Steps
Once collections are created:
1. Setup React Native API client
2. Implement authentication flow
3. Create CRUD screens for racquet management