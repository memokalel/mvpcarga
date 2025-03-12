/*
  # Add vehicle reference to users table
  
  1. Changes
    - Add vehicle_id column to users table
    - Add foreign key constraint to vehicles table
    
  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE users
ADD COLUMN IF NOT EXISTS vehicle_id uuid REFERENCES vehicles(id);

-- Update existing RLS policies to include new column
CREATE POLICY "Users can update own vehicle"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);