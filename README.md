# Gestor de Películas y Series - Interfaz Premium

Una aplicación web moderna y elegante para gestionar tu biblioteca personal de películas y series con un diseño ultra-moderno y funcionalidades avanzadas.

## Características Principales

### Diseño Premium
- **Glassmorphism**: Efectos de cristal y transparencia modernos
- **Modo Oscuro/Claro**: Toggle dinámico entre temas
- **Animaciones Fluidas**: Transiciones suaves y efectos visuales
- **Responsive Design**: Optimizado para todos los dispositivos
- **Fuentes Premium**: Inter y Poppins para mejor legibilidad

### Funcionalidades Avanzadas
- **CRUD Completo**: Crear, leer, actualizar y eliminar películas y series
- **Búsqueda en Tiempo Real**: Filtrado instantáneo de contenido
- **Filtros Inteligentes**: Por calificación y año dinámicos
- **Indicadores Visuales**: Barras de progreso para calificaciones
- **Notificaciones Toast**: Sistema de alertas elegante
- **Dashboard Interactivo**: Estadísticas y gráficos visuales
- **Exportación CSV/JSON**: Exportar datos en múltiples formatos

### Dashboard Mejorado
- **Estadísticas en Tiempo Real**: Contadores dinámicos
- **Gráficos Visuales**: Distribución de contenido
- **Acciones Rápidas**: Acceso directo a funciones principales
- **Información Contextual**: Consejos y próximas funcionalidades

## Nuevas Funcionalidades Implementadas

### 1. Sistema de Temas
- Toggle entre modo oscuro y claro
- Persistencia de preferencias
- Transiciones suaves entre temas

### 2. Búsqueda y Filtros
- Búsqueda global desde el header
- Filtros por calificación (Alta/Media/Baja)
- Filtros por año dinámicos
- Contador de resultados

### 3. CRUD Completo
- Agregar películas y series
- Editar registros existentes
- Eliminar con confirmación
- Indicadores visuales de estado

### 4. Notificaciones Toast
- Sistema de notificaciones no intrusivo
- Diferentes tipos: éxito, error, info, warning
- Auto-dismiss con animaciones

### 5. Exportación de Datos
- Exportar películas a CSV y JSON
- Exportar series a CSV y JSON
- Exportar toda la biblioteca

## Arquitectura Modular

El proyecto sigue una arquitectura modular con separación de responsabilidades:

```
app/
├── __init__.py              # Package principal
├── config.py                # Configuración y variables de entorno
├── routes/                  # Blueprints de Flask
│   ├── __init__.py
│   ├── principal.py         # Rutas principales (index, búsqueda)
│   ├── peliculas.py         # CRUD de películas
│   ├── series.py            # CRUD de series
│   └── exportar.py          # Exportación CSV/JSON
├── models/                  # Modelos de datos
│   ├── __init__.py
│   ├── pelicula.py          # Lógica de películas
│   └── serie.py             # Lógica de series
├── services/                # Servicios de negocio
│   ├── __init__.py
│   ├── database.py          # Conexión a PostgreSQL
│   └── export.py            # Servicios de exportación
├── static/                  # Archivos estáticos
│   ├── css/
│   │   └── style.css        # Estilos premium
│   └── js/
│       └── script.js        # Funcionalidades JavaScript
└── templates/               # Templates Jinja2
    ├── base.html            # Plantilla base con navegación
    ├── index.html           # Dashboard principal
    ├── buscar.html          # Resultados de búsqueda
    ├── peliculas/           # Templates de películas
    │   ├── listar.html
    │   └── editar.html
    ├── series/              # Templates de series
    │   ├── listar.html
    │   └── editar.html
    └── exportar/            # Templates de exportación
        └── index.html
```

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Variables CSS, Grid, Flexbox, Animaciones
- **JavaScript**: Funcionalidades interactivas
- **Flask**: Backend en Python con Blueprints
- **PostgreSQL**: Base de datos relacional
- **python-dotenv**: Variables de entorno
- **click**: Interfaz de línea de comandos

## Instalación y Uso

1. Clona el repositorio
2. Crea un archivo `.env` basado en `.env.example`
3. Instala las dependencias: `pip3 install -r requirements.txt`
4. Ejecuta el script SQL: `psql -U postgres -d Pelis -f init_db.sql`
5. Ejecuta la aplicación: `python3 run.py`
6. Abre tu navegador en `http://localhost:5002`

### Opciones de línea de comandos

```bash
# Ejecutar con opciones personalizadas
python3 run.py --host 0.0.0.0 --port 8080 --no-debug

# Ver ayuda
python3 run.py --help
```

## Configuración de Base de datos

La aplicación usa PostgreSQL. Configura las credenciales en el archivo `.env`:

```
DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_bd
SECRET_KEY=tu-clave-secreta
```

## Próximas Mejoras

- [ ] Sistema de géneros completo
- [ ] Listas de favoritos
- [ ] Recomendaciones personalizadas
- [ ] Estadísticas avanzadas
- [ ] Importación de datos
- [ ] Sincronización en la nube
- [ ] Modo offline
- [ ] Temas personalizables

## Licencia

Este proyecto está bajo la Licencia MIT. Puedes usarlo libremente para proyectos personales y comerciales.

---

**Desarrollado con mucho café**
