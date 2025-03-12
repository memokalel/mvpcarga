/*
  # Add battery capacity to users table

  1. Changes
    - Add battery_capacity column to users table with proper validation
    - Update existing rows to have a default value before adding constraint
    - Remove old battery_range constraint
    - Add new battery_capacity constraint

  2. Security
    - Maintain existing RLS policies
*/

-- Add battery_capacity column without constraint first
ALTER TABLE users
ADD COLUMN IF NOT EXISTS battery_capacity text;

-- Update any existing rows to have a default value
UPDATE users
SET battery_capacity = '60'
WHERE battery_capacity IS NULL;

-- Drop the old battery_range constraint if it exists
ALTER TABLE users
DROP CONSTRAINT IF EXISTS valid_battery_range;

-- Now add the constraint after ensuring all rows have valid values
ALTER TABLE users
ADD CONSTRAINT valid_battery_capacity
CHECK (
  CASE
    WHEN battery_capacity ~ '^\d+$' THEN
      CAST(battery_capacity AS integer) BETWEEN 20 AND 100
    ELSE false
  END
);

-- Add an index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_battery_capacity ON users (battery_capacity);

COMMENT ON COLUMN users.battery_capacity IS 'Battery capacity in kWh (20-100)';