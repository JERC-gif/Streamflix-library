-- Crear tabla de géneros
CREATE TABLE IF NOT EXISTS generos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- Agregar campo género a películas
ALTER TABLE peliculas ADD COLUMN IF NOT EXISTS genero_id INTEGER REFERENCES generos(id);

-- Agregar campo género a series
ALTER TABLE series ADD COLUMN IF NOT EXISTS genero_id INTEGER REFERENCES generos(id);

-- Insertar géneros predeterminados
INSERT INTO generos (nombre) VALUES 
    ('Acción'),
    ('Aventura'),
    ('Animación'),
    ('Comedia'),
    ('Crimen'),
    ('Documental'),
    ('Drama'),
    ('Fantasía'),
    ('Historia'),
    ('Horror'),
    ('Misterio'),
    ('Romance'),
    ('Ciencia Ficción'),
    ('Thriller'),
    ('Western')
ON CONFLICT (nombre) DO NOTHING;
