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
- **Exportación CSV**: Exportar datos en formato CSV

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
- Exportar películas a CSV
- Exportar series a CSV
- Exportar toda la biblioteca

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Variables CSS, Grid, Flexbox, Animaciones
- **JavaScript**: Funcionalidades interactivas
- **Flask**: Backend en Python
- **PostgreSQL**: Base de datos relacional
- **python-dotenv**: Variables de entorno

## Estructura de Archivos

```
Gestor de Películas y Series/
├── templates/
│   ├── base.html              # Plantilla base con navegación
│   ├── index.html             # Dashboard principal
│   ├── peliculas.html         # Gestión de películas
│   ├── series.html            # Gestión de series
│   ├── exportar.html          # Exportación de datos
│   ├── editar_pelicula.html   # Formulario edición película
│   ├── editar_serie.html      # Formulario edición serie
│   └── buscar.html            # Resultados de búsqueda
├── static/
│   ├── style.css              # Estilos premium
│   └── script.js              # Funcionalidades JavaScript
├── app.py                     # Aplicación Flask
├── db.py                      # Conexión a base de datos
├── series.py                  # Lógica de series
├── exportar.py                # Lógica de exportación
├── init_db.sql                # Script inicial de base de datos
├── .env                       # Variables de entorno (no subir a git)
├── .env.example               # Ejemplo de variables de entorno
├── .gitignore                 # Archivos ignorados por git
└── requirements.txt           # Dependencias de Python
```

## Instalación y Uso

1. Clona el repositorio
2. Crea un archivo `.env` basado en `.env.example`
3. Instala las dependencias: `pip install -r requirements.txt`
4. Ejecuta el script SQL: `psql -U postgres -d Pelis -f init_db.sql`
5. Ejecuta la aplicación: `python app.py`
6. Abre tu navegador en `http://localhost:5002`

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
