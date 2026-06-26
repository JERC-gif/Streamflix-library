from api.services.database import get_connection

def obtener_todas():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nombre, anio, calificacion, fecha_terminado, imagen IS NOT NULL as tiene_imagen FROM series ORDER BY anio;")
    series = cur.fetchall()
    cur.close()
    conn.close()
    return series

def obtener_anios():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT anio FROM series WHERE anio IS NOT NULL ORDER BY anio DESC;")
    anios = [row[0] for row in cur.fetchall()]
    cur.close()
    conn.close()
    return anios

def obtener_por_id(id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nombre, anio, calificacion, fecha_terminado, imagen IS NOT NULL as tiene_imagen FROM series WHERE id=%s;", (id,))
    serie = cur.fetchone()
    cur.close()
    conn.close()
    return serie

def crear(nombre, anio, calificacion, fecha_terminado):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO series (nombre, anio, calificacion, fecha_terminado)
        VALUES (%s, %s, %s, %s)
        RETURNING id;
    """, (nombre, anio, calificacion, fecha_terminado))
    serie_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return serie_id

def actualizar(id, nombre, anio, calificacion, fecha_terminado):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE series 
        SET nombre=%s, anio=%s, calificacion=%s, fecha_terminado=%s
        WHERE id=%s;
    """, (nombre, anio, calificacion, fecha_terminado, id))
    conn.commit()
    cur.close()
    conn.close()

def eliminar(id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM series WHERE id=%s;", (id,))
    conn.commit()
    cur.close()
    conn.close()

def contar():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM series;")
    count = cur.fetchone()[0]
    cur.close()
    conn.close()
    return count

def guardar_imagen(id, imagen_bytes):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE series SET imagen=%s WHERE id=%s;", (imagen_bytes, id))
    conn.commit()
    cur.close()
    conn.close()

def obtener_imagen(id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT imagen FROM series WHERE id=%s;", (id,))
    result = cur.fetchone()
    cur.close()
    conn.close()
    return result[0] if result else None

def buscar(query):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, nombre, anio, calificacion, fecha_terminado 
        FROM series 
        WHERE nombre ILIKE %s
        ORDER BY nombre;
    """, (f'%{query}%',))
    series = cur.fetchall()
    cur.close()
    conn.close()
    return series
