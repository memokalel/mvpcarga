/*
  # Base de datos de vehículos eléctricos

  1. Nueva Tabla
    - `vehicles`
      - `id` (uuid, primary key)
      - `brand` (text) - Marca del vehículo
      - `model` (text) - Modelo del vehículo
      - `year` (integer) - Año del modelo
      - `battery_capacity` (integer) - Capacidad de la batería en kWh
      - `connector_type` (text) - Tipo de conector (ccs2, chademo, type2)
      - `range_km` (integer) - Autonomía en kilómetros
      - `charging_power` (integer) - Potencia máxima de carga en kW
      - `created_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en la tabla `vehicles`
    - Permitir lectura pública
    - Restringir escritura solo a administradores

  3. Datos Iniciales
    - Insertar vehículos comunes en México
*/

-- Crear tabla de vehículos
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  battery_capacity integer NOT NULL,
  connector_type text NOT NULL,
  range_km integer NOT NULL,
  charging_power integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_connector_type CHECK (connector_type = ANY (ARRAY['ccs2', 'chademo', 'type2']))
);

-- Habilitar RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública
CREATE POLICY "Permitir lectura pública de vehículos"
  ON vehicles
  FOR SELECT
  TO public
  USING (true);

-- Insertar datos de vehículos comunes
INSERT INTO vehicles (brand, model, year, battery_capacity, connector_type, range_km, charging_power)
VALUES
  ('Tesla', 'Model 3', 2024, 82, 'ccs2', 513, 250),
  ('Tesla', 'Model Y', 2024, 75, 'ccs2', 450, 250),
  ('BMW', 'iX3', 2024, 74, 'ccs2', 460, 150),
  ('Chevrolet', 'Bolt EUV', 2024, 65, 'ccs2', 397, 55),
  ('Hyundai', 'IONIQ 5', 2024, 77, 'ccs2', 488, 350),
  ('Kia', 'EV6', 2024, 77, 'ccs2', 484, 350),
  ('Nissan', 'LEAF', 2024, 62, 'chademo', 363, 50),
  ('Porsche', 'Taycan', 2024, 93, 'ccs2', 484, 270),
  ('Volkswagen', 'ID.4', 2024, 82, 'ccs2', 452, 135),
  ('Audi', 'e-tron GT', 2024, 93, 'ccs2', 487, 270),
  ('Mercedes-Benz', 'EQS', 2024, 107, 'ccs2', 563, 200),
  ('Ford', 'Mustang Mach-E', 2024, 88, 'ccs2', 490, 150),
  ('BYD', 'Han', 2024, 85, 'ccs2', 506, 120),
  ('JAC', 'E10X', 2024, 30, 'type2', 302, 30),
  ('MG', 'Marvel R', 2024, 70, 'ccs2', 402, 92);