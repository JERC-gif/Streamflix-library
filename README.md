# StreamFlix - Gestor de Películas y Series

Aplicación web fullstack para gestionar tu biblioteca personal de películas y series.

## Arquitectura

```
├── api/                    # Backend Flask-RESTful
│   ├── app.py              # App factory
│   ├── config.py           # Configuración
│   ├── models/             # Modelos de datos
│   ├── routes/             # Endpoints REST
│   └── services/           # Servicios (DB, export)
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas
│   │   └── services/       # Servicio API
│   └── vite.config.js
├── run.py                  # Punto de entrada API
├── requirements.txt        # Dependencias Python
└── .env                    # Variables de entorno
```

## Características

- **CRUD completo** de películas y series
- **Subida de imágenes** (portadas)
- **Selector de fechas** con Flatpickr
- **Búsqueda** en tiempo real
- **Filtros** por año y calificación
- **Exportación** CSV y JSON
- **Modo oscuro/claro**
- **Responsive design**

## Tecnologías

**Backend:**
- Python 3.12
- Flask + Flask-RESTful
- PostgreSQL
- Pillow (procesamiento de imágenes)

**Frontend:**
- React 18
- Vite
- React Router
- Axios
- Flatpickr

## Instalación

### Backend

```bash
# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos
cp .env.example .env
# Editar .env con tus credenciales

# Crear tablas
psql -U postgres -d Pelis -f init_db.sql
psql -U postgres -d Pelis -f add_imagen_column.sql

# Ejecutar API
python3 run.py
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## API REST Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/peliculas` | Listar películas |
| POST | `/api/peliculas` | Crear película |
| GET | `/api/peliculas/:id` | Obtener película |
| PUT | `/api/peliculas/:id` | Actualizar película |
| DELETE | `/api/peliculas/:id` | Eliminar película |
| POST | `/api/peliculas/:id/imagen` | Subir imagen |
| GET | `/api/peliculas/:id/imagen` | Obtener imagen |
| GET | `/api/series` | Listar series |
| POST | `/api/series` | Crear serie |
| GET | `/api/series/:id` | Obtener serie |
| PUT | `/api/series/:id` | Actualizar serie |
| DELETE | `/api/series/:id` | Eliminar serie |
| POST | `/api/series/:id/imagen` | Subir imagen |
| GET | `/api/series/:id/imagen` | Obtener imagen |
| GET | `/api/stats` | Estadísticas |
| GET | `/api/export/:format` | Exportar CSV/JSON |

## Uso

1. Iniciar el backend: `python3 run.py` (puerto 5002)
2. Iniciar el frontend: `cd frontend && npm run dev` (puerto 3000)
3. Abrir `http://localhost:3000`

## Licencia

MIT
