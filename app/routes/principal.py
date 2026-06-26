from flask import Blueprint, render_template, request, redirect, url_for, flash
from app.services.database import get_connection
import app.models.pelicula as pelicula_model
import app.models.serie as serie_model

principal_bp = Blueprint('principal', __name__)

@principal_bp.route('/')
def index():
    peliculas_count = pelicula_model.contar()
    series_count = serie_model.contar()
    promedio_calificacion = 0

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT AVG(calificacion) 
            FROM (
                SELECT calificacion FROM peliculas WHERE calificacion IS NOT NULL
                UNION ALL
                SELECT calificacion FROM series WHERE calificacion IS NOT NULL
            ) AS all_ratings;
        """)
        result = cur.fetchone()
        promedio_calificacion = result[0] if result[0] else 0
        cur.close()
        conn.close()
    except Exception as e:
        flash(f"Error al obtener datos: {e}", "error")

    return render_template('index.html',
                         peliculas_count=peliculas_count,
                         series_count=series_count,
                         promedio_calificacion=promedio_calificacion)

@principal_bp.route('/buscar')
def buscar():
    query = request.args.get('q', '').strip()
    if not query:
        return redirect(url_for('principal.index'))

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT 'pelicula' as tipo, id, nombre, anio, calificacion 
            FROM peliculas 
            WHERE nombre ILIKE %s
            UNION ALL
            SELECT 'serie' as tipo, id, nombre, anio, calificacion 
            FROM series 
            WHERE nombre ILIKE %s
            ORDER BY nombre;
        """, (f'%{query}%', f'%{query}%'))
        resultados = cur.fetchall()
        cur.close()
        conn.close()
    except Exception as e:
        flash(f"Error en la búsqueda: {e}", "error")
        resultados = []

    return render_template('buscar.html', query=query, resultados=resultados)
