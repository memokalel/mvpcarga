/*
  # Agregar imágenes a las estaciones de carga

  1. Cambios
    - Agregar columna images como array de texto a la tabla charging_stations
    - Actualizar las estaciones existentes con imágenes de ejemplo
*/

-- Agregar columna de imágenes
ALTER TABLE charging_stations
ADD COLUMN images text[] DEFAULT '{}';

-- Actualizar las estaciones existentes con imágenes
UPDATE charging_stations
SET images = ARRAY['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop&q=80']
WHERE name = 'Estación Central Oaxaca';

UPDATE charging_stations
SET images = ARRAY['https://images.unsplash.com/photo-1647500666543-6a42566b7e86?w=800&auto=format&fit=crop&q=80']
WHERE name = 'Plaza Oaxaca EV Station';

UPDATE charging_stations
SET images = ARRAY['https://images.unsplash.com/photo-1601997123253-2a54a7d37c7d?w=800&auto=format&fit=crop&q=80']
WHERE name = 'Centro Comercial Tesla Supercharger';

UPDATE charging_stations
SET images = ARRAY['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop&q=80']
WHERE name = 'Parque Las Canteras Charging Hub';

UPDATE charging_stations
SET images = ARRAY['https://images.unsplash.com/photo-1647500666543-6a42566b7e86?w=800&auto=format&fit=crop&q=80']
WHERE name = 'Hotel Victoria Charging Station';