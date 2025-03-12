/*
  # Initial Schema for EV Charging App

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `email` (text, unique)
      - `connector_type` (text)
      - `battery_range` (text)
      - `vehicle_name` (text, optional)
    
    - `charging_stations`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name` (text)
      - `address` (text)
      - `latitude` (float8)
      - `longitude` (float8)
      - `status` (text)
      - `total_connectors` (int)
      - `available_connectors` (int)
      - `power_kw` (float8)
      - `price_per_kwh` (float8)
      - `last_updated` (timestamp)

    - `station_connectors`
      - `id` (uuid, primary key)
      - `station_id` (uuid, references charging_stations)
      - `connector_type` (text)
      - `power_kw` (float8)
      - `status` (text)

    - `reservations`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `user_id` (uuid, references users)
      - `station_id` (uuid, references charging_stations)
      - `connector_id` (uuid, references station_connectors)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `status` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  email text UNIQUE NOT NULL,
  connector_type text,
  battery_range text,
  vehicle_name text,
  CONSTRAINT valid_connector_type CHECK (connector_type IN ('ccs2', 'chademo', 'type2')),
  CONSTRAINT valid_battery_range CHECK (battery_range IN ('small', 'medium', 'large', 'xlarge'))
);

-- Create charging stations table
CREATE TABLE IF NOT EXISTS charging_stations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  address text NOT NULL,
  latitude float8 NOT NULL,
  longitude float8 NOT NULL,
  status text NOT NULL DEFAULT 'available',
  total_connectors int NOT NULL DEFAULT 0,
  available_connectors int NOT NULL DEFAULT 0,
  power_kw float8 NOT NULL,
  price_per_kwh float8 NOT NULL,
  last_updated timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('available', 'waiting', 'unavailable')),
  CONSTRAINT valid_connectors CHECK (available_connectors <= total_connectors)
);

-- Create station connectors table
CREATE TABLE IF NOT EXISTS station_connectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id uuid REFERENCES charging_stations ON DELETE CASCADE,
  connector_type text NOT NULL,
  power_kw float8 NOT NULL,
  status text NOT NULL DEFAULT 'available',
  CONSTRAINT valid_connector_type CHECK (connector_type IN ('ccs2', 'chademo', 'type2')),
  CONSTRAINT valid_status CHECK (status IN ('available', 'waiting', 'unavailable'))
);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES users ON DELETE CASCADE,
  station_id uuid REFERENCES charging_stations ON DELETE CASCADE,
  connector_id uuid REFERENCES station_connectors ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  CONSTRAINT valid_status CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE charging_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE station_connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for charging stations
CREATE POLICY "Anyone can read charging stations"
  ON charging_stations
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for station connectors
CREATE POLICY "Anyone can read station connectors"
  ON station_connectors
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for reservations
CREATE POLICY "Users can read own reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create reservations"
  ON reservations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reservations"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_stations_location ON charging_stations (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_stations_status ON charging_stations (status);
CREATE INDEX IF NOT EXISTS idx_connectors_type ON station_connectors (connector_type);
CREATE INDEX IF NOT EXISTS idx_reservations_time ON reservations (start_time, end_time);