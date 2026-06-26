from db import get_connection

def insertar_serie(nombre, anio=None, calificacion=None, fecha_terminado=None):
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
    print(f"Serie '{nombre}' registrada con ID {serie_id}")

def listar_series():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nombre, anio, calificacion, fecha_terminado FROM series ORDER BY anio;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    if not rows:
        print("No hay series registradas.")
        return

    print("\nLista de series:")
    for r in rows:
        print(f"{r[0]} | {r[1]} | {r[2] or '-'} | {r[3] or '-'} | {r[4] or '-'}")
