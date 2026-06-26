from api.services.database import get_connection

def obtener_todas():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nombre, anio, calificacion, fecha_vista, imagen IS NOT NULL as tiene_imagen FROM peliculas ORDER BY anio;")
    peliculas = cur.fetchall()
    cur.close()
    conn.close()
    return peliculas

def obtener_anios():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT anio FROM peliculas WHERE anio IS NOT NULL ORDER BY anio DESC;")
    anios = [row[0] for row in cur.fetchall()]
    cur.close()
    conn.close()
    return anios

def obtener_por_id(id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nombre, anio, calificacion, fecha_vista, imagen IS NOT NULL as tiene_imagen FROM peliculas WHERE id=%s;", (id,))
    pelicula = cur.fetchone()
    cur.close()
    conn.close()
    return pelicula

def crear(nombre, anio, calificacion, fecha_vista):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO peliculas (nombre, anio, calificacion, fecha_vista)
        VALUES (%s, %s, %s, %s)
        RETURNING id;
    """, (nombre, anio, calificacion, fecha_vista))
    pelicula_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return pelicula_id

def actualizar(id, nombre, anio, calificacion, fecha_vista):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE peliculas 
        SET nombre=%s, anio=%s, calificacion=%s, fecha_vista=%s
        WHERE id=%s;
    """, (nombre, anio, calificacion, fecha_vista, id))
    conn.commit()
    cur.close()
    conn.close()

def eliminar(id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM peliculas WHERE id=%s;", (id,))
    conn.commit()
    cur.close()
    conn.close()

def contar():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM peliculas;")
    count = cur.fetchone()[0]
    cur.close()
    conn.close()
    return count

def guardar_imagen(id, imagen_bytes):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE peliculas SET imagen=%s WHERE id=%s;", (imagen_bytes, id))
    conn.commit()
    cur.close()
    conn.close()

def obtener_imagen(id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT imagen FROM peliculas WHERE id=%s;", (id,))
    result = cur.fetchone()
    cur.close()
    conn.close()
    return result[0] if result else None

def buscar(query):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, nombre, anio, calificacion, fecha_vista 
        FROM peliculas 
        WHERE nombre ILIKE %s
        ORDER BY nombre;
    """, (f'%{query}%',))
    peliculas = cur.fetchall()
    cur.close()
    conn.close()
    return peliculas
