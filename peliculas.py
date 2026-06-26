from db import get_connection

def insertar_pelicula(nombre, anio=None, calificacion=None, fecha_vista=None):
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
    print(f"✅ Película '{nombre}' registrada con ID {pelicula_id}")

def listar_peliculas():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nombre, anio, calificacion, fecha_vista FROM peliculas ORDER BY anio;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    if not rows:
        print("⚠️ No hay películas registradas.")
        return

    print("\n📋 Lista de películas:")
    for r in rows:
        print(f"{r[0]} | {r[1]} | {r[2] or '-'} | {r[3] or '-'} | {r[4] or '-'}")
