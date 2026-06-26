import csv
import json
from io import StringIO
from flask import Response
from app.services.database import get_connection

def exportar_peliculas_csv():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nombre, anio, calificacion, fecha_vista FROM peliculas ORDER BY anio;")
    peliculas = cur.fetchall()
    cur.close()
    conn.close()

    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['ID', 'Nombre', 'Año', 'Calificación', 'Fecha vista'])
    writer.writerows(peliculas)

    return Response(
        output.getvalue(),
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=peliculas_exportadas.csv'}
    )

def exportar_series_csv():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nombre, anio, calificacion, fecha_terminado FROM series ORDER BY anio;")
    series = cur.fetchall()
    cur.close()
    conn.close()

    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['ID', 'Nombre', 'Año', 'Calificación', 'Fecha terminada'])
    writer.writerows(series)

    return Response(
        output.getvalue(),
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=series_exportadas.csv'}
    )

def exportar_todo_csv():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, nombre, anio, calificacion, fecha_vista FROM peliculas ORDER BY anio;")
    peliculas = cur.fetchall()

    cur.execute("SELECT id, nombre, anio, calificacion, fecha_terminado FROM series ORDER BY anio;")
    series = cur.fetchall()

    cur.close()
    conn.close()

    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['Tipo', 'ID', 'Nombre', 'Año', 'Calificación', 'Fecha'])

    for pelicula in peliculas:
        writer.writerow(['Película'] + list(pelicula))

    for serie in series:
        writer.writerow(['Serie'] + list(serie))

    return Response(
        output.getvalue(),
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=biblioteca_completa.csv'}
    )

def exportar_peliculas_json():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nombre, anio, calificacion, fecha_vista FROM peliculas ORDER BY anio;")
    peliculas = cur.fetchall()
    cur.close()
    conn.close()

    data = []
    for p in peliculas:
        data.append({
            'id': p[0],
            'nombre': p[1],
            'anio': p[2],
            'calificacion': float(p[3]) if p[3] else None,
            'fecha_vista': str(p[4]) if p[4] else None
        })

    return Response(
        json.dumps(data, indent=2, ensure_ascii=False),
        mimetype='application/json',
        headers={'Content-Disposition': 'attachment; filename=peliculas_exportadas.json'}
    )

def exportar_series_json():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nombre, anio, calificacion, fecha_terminado FROM series ORDER BY anio;")
    series = cur.fetchall()
    cur.close()
    conn.close()

    data = []
    for s in series:
        data.append({
            'id': s[0],
            'nombre': s[1],
            'anio': s[2],
            'calificacion': float(s[3]) if s[3] else None,
            'fecha_terminado': str(s[4]) if s[4] else None
        })

    return Response(
        json.dumps(data, indent=2, ensure_ascii=False),
        mimetype='application/json',
        headers={'Content-Disposition': 'attachment; filename=series_exportadas.json'}
    )

def exportar_todo_json():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, nombre, anio, calificacion, fecha_vista FROM peliculas ORDER BY anio;")
    peliculas = cur.fetchall()

    cur.execute("SELECT id, nombre, anio, calificacion, fecha_terminado FROM series ORDER BY anio;")
    series = cur.fetchall()

    cur.close()
    conn.close()

    data = {'peliculas': [], 'series': []}

    for p in peliculas:
        data['peliculas'].append({
            'id': p[0],
            'nombre': p[1],
            'anio': p[2],
            'calificacion': float(p[3]) if p[3] else None,
            'fecha_vista': str(p[4]) if p[4] else None
        })

    for s in series:
        data['series'].append({
            'id': s[0],
            'nombre': s[1],
            'anio': s[2],
            'calificacion': float(s[3]) if s[3] else None,
            'fecha_terminado': str(s[4]) if s[4] else None
        })

    return Response(
        json.dumps(data, indent=2, ensure_ascii=False),
        mimetype='application/json',
        headers={'Content-Disposition': 'attachment; filename=biblioteca_completa.json'}
    )
