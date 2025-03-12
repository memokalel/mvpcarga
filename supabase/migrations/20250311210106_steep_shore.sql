/*
  # Add user insert policy
  
  1. Changes
    - Add policy to allow authenticated users to insert their own data
    
  2. Security
    - Users can only insert data for their own ID
    - Maintains existing read and update policies
*/

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);