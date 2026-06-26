from db import get_connection

def exportar_peliculas():
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

    with open("peliculas_exportadas.txt", "w", encoding="utf-8") as f:
        f.write("ID | Nombre | Año | Calificación | Fecha vista\n")
        f.write("-" * 60 + "\n")
        for r in rows:
            f.write(f"{r[0]} | {r[1]} | {r[2] or '-'} | {r[3] or '-'} | {r[4] or '-'}\n")
    print("\n✅ Películas exportadas en 'peliculas_exportadas.txt'")

def exportar_series():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nombre, anio, fecha_terminado FROM series ORDER BY anio;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    if not rows:
        print("⚠️ No hay series registradas.")
        return

    print("\n📺 Lista de series:")
    for r in rows:
        print(f"{r[0]} | {r[1]} | {r[2] or '-'} | {r[3] or '-'}")

    with open("series_exportadas.txt", "w", encoding="utf-8") as f:
        f.write("ID | Nombre | Año | Fecha terminada\n")
        f.write("-" * 50 + "\n")
        for r in rows:
            f.write(f"{r[0]} | {r[1]} | {r[2] or '-'} | {r[3] or '-'}\n")
    print("\n✅ Series exportadas en 'series_exportadas.txt'")
