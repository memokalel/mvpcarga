/*
  # Agregar estaciones de carga de ejemplo

  1. Cambios
    - Insertar datos de ejemplo en la tabla charging_stations
    - Insertar conectores asociados en la tabla station_connectors
    
  2. Datos
    - 5 estaciones de carga en diferentes ubicaciones de Oaxaca
    - Diferentes tipos de conectores y potencias
    - Precios y disponibilidad variados
*/

-- Insertar estaciones de carga
INSERT INTO charging_stations 
(name, address, latitude, longitude, status, total_connectors, available_connectors, power_kw, price_per_kwh)
VALUES
  (
    'Estación Central Oaxaca',
    'Av. Universidad 123, Centro',
    17.0669, 
    -96.7203,
    'available',
    4,
    3,
    150,
    3.50
  ),
  (
    'Plaza Oaxaca EV Station',
    'Blvd. Guelaguetza 456',
    17.0732,
    -96.7266,
    'waiting',
    3,
    1,
    50,
    3.75
  ),
  (
    'Centro Comercial Tesla Supercharger',
    'Calle Reforma 789',
    17.0612,
    -96.7257,
    'available',
    8,
    5,
    250,
    4.00
  ),
  (
    'Parque Las Canteras Charging Hub',
    'Av. Ferrocarril 234',
    17.0789,
    -96.7159,
    'available',
    6,
    4,
    120,
    3.25
  ),
  (
    'Hotel Victoria Charging Station',
    'Calle Simbolos Patrios 982',
    17.0534,
    -96.7145,
    'available',
    2,
    2,
    60,
    3.80
  );

-- Insertar conectores para cada estación
INSERT INTO station_connectors 
(station_id, connector_type, power_kw, status)
SELECT 
  id as station_id,
  'ccs2' as connector_type,
  power_kw,
  status
FROM charging_stations
WHERE name = 'Estación Central Oaxaca';

INSERT INTO station_connectors 
(station_id, connector_type, power_kw, status)
SELECT 
  id as station_id,
  'chademo' as connector_type,
  power_kw,
  status
FROM charging_stations
WHERE name = 'Estación Central Oaxaca';

INSERT INTO station_connectors 
(station_id, connector_type, power_kw, status)
SELECT 
  id as station_id,
  'type2' as connector_type,
  11 as power_kw,
  status
FROM charging_stations
WHERE name = 'Estación Central Oaxaca';

-- Plaza Oaxaca
INSERT INTO station_connectors 
(station_id, connector_type, power_kw, status)
SELECT 
  id as station_id,
  'ccs2' as connector_type,
  power_kw,
  status
FROM charging_stations
WHERE name = 'Plaza Oaxaca EV Station';

INSERT INTO station_connectors 
(station_id, connector_type, power_kw, status)
SELECT 
  id as station_id,
  'type2' as connector_type,
  11 as power_kw,
  status
FROM charging_stations
WHERE name = 'Plaza Oaxaca EV Station';

-- Tesla Supercharger
INSERT INTO station_connectors 
(station_id, connector_type, power_kw, status)
SELECT 
  id as station_id,
  'ccs2' as connector_type,
  power_kw,
  status
FROM charging_stations
WHERE name = 'Centro Comercial Tesla Supercharger';

-- Parque Las Canteras
INSERT INTO station_connectors 
(station_id, connector_type, power_kw, status)
SELECT 
  id as station_id,
  'ccs2' as connector_type,
  power_kw,
  status
FROM charging_stations
WHERE name = 'Parque Las Canteras Charging Hub';

INSERT INTO station_connectors 
(station_id, connector_type, power_kw, status)
SELECT 
  id as station_id,
  'type2' as connector_type,
  11 as power_kw,
  status
FROM charging_stations
WHERE name = 'Parque Las Canteras Charging Hub';

-- Hotel Victoria
INSERT INTO station_connectors 
(station_id, connector_type, power_kw, status)
SELECT 
  id as station_id,
  'type2' as connector_type,
  power_kw,
  status
FROM charging_stations
WHERE name = 'Hotel Victoria Charging Station';