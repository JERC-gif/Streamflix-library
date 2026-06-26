from flask import Flask, render_template, request, redirect, url_for, flash, send_file
from db import get_connection
from io import StringIO
import csv
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'fallback-secret-key')

@app.route('/')
def index():
    peliculas_count = 0
    series_count = 0
    promedio_calificacion = 0
    
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("SELECT COUNT(*) FROM peliculas;")
        peliculas_count = cur.fetchone()[0]
        
        cur.execute("SELECT COUNT(*) FROM series;")
        series_count = cur.fetchone()[0]
        
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

@app.route('/peliculas')
def peliculas():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, nombre, anio, calificacion, fecha_vista FROM peliculas ORDER BY anio;")
        peliculas = cur.fetchall()
        
        cur.execute("SELECT DISTINCT anio FROM peliculas WHERE anio IS NOT NULL ORDER BY anio DESC;")
        años = [row[0] for row in cur.fetchall()]
        
        cur.close()
        conn.close()
    except Exception as e:
        flash(f"Error al obtener películas: {e}", "error")
        peliculas = []
        años = []
    
    return render_template('peliculas.html', peliculas=peliculas, años=años)

@app.route('/agregar_pelicula', methods=['POST'])
def agregar_pelicula():
    nombre = request.form['nombre']
    anio = request.form['anio'] or None
    calificacion = request.form['calificacion'] or None
    fecha_vista = request.form['fecha_vista'] or None
    
    try:
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
        flash(f"Película '{nombre}' registrada con ID {pelicula_id}", "success")
    except Exception as e:
        flash(f"Error al agregar película: {e}", "error")
    
    return redirect(url_for('peliculas'))

@app.route('/editar_pelicula/<int:id>', methods=['GET', 'POST'])
def editar_pelicula(id):
    if request.method == 'POST':
        nombre = request.form['nombre']
        anio = request.form['anio'] or None
        calificacion = request.form['calificacion'] or None
        fecha_vista = request.form['fecha_vista'] or None
        
        try:
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
            flash(f"Película '{nombre}' actualizada", "success")
        except Exception as e:
            flash(f"Error al actualizar película: {e}", "error")
        
        return redirect(url_for('peliculas'))
    
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, nombre, anio, calificacion, fecha_vista FROM peliculas WHERE id=%s;", (id,))
        pelicula = cur.fetchone()
        cur.close()
        conn.close()
    except Exception as e:
        flash(f"Error al obtener película: {e}", "error")
        return redirect(url_for('peliculas'))
    
    return render_template('editar_pelicula.html', pelicula=pelicula)

@app.route('/eliminar_pelicula/<int:id>', methods=['POST'])
def eliminar_pelicula(id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM peliculas WHERE id=%s;", (id,))
        conn.commit()
        cur.close()
        conn.close()
        flash("Película eliminada correctamente", "success")
    except Exception as e:
        flash(f"Error al eliminar película: {e}", "error")
    
    return redirect(url_for('peliculas'))

@app.route('/series')
def series():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, nombre, anio, calificacion, fecha_terminado FROM series ORDER BY anio;")
        series = cur.fetchall()
        
        cur.execute("SELECT DISTINCT anio FROM series WHERE anio IS NOT NULL ORDER BY anio DESC;")
        años = [row[0] for row in cur.fetchall()]
        
        cur.close()
        conn.close()
    except Exception as e:
        flash(f"Error al obtener series: {e}", "error")
        series = []
        años = []
    
    return render_template('series.html', series=series, años=años)

@app.route('/agregar_serie', methods=['POST'])
def agregar_serie():
    nombre = request.form['nombre']
    anio = request.form['anio'] or None
    calificacion = request.form['calificacion'] or None
    fecha_terminado = request.form['fecha_terminado'] or None
    
    try:
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
        flash(f"Serie '{nombre}' registrada con ID {serie_id}", "success")
    except Exception as e:
        flash(f"Error al agregar serie: {e}", "error")
    
    return redirect(url_for('series'))

@app.route('/editar_serie/<int:id>', methods=['GET', 'POST'])
def editar_serie(id):
    if request.method == 'POST':
        nombre = request.form['nombre']
        anio = request.form['anio'] or None
        calificacion = request.form['calificacion'] or None
        fecha_terminado = request.form['fecha_terminado'] or None
        
        try:
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
            flash(f"Serie '{nombre}' actualizada", "success")
        except Exception as e:
            flash(f"Error al actualizar serie: {e}", "error")
        
        return redirect(url_for('series'))
    
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, nombre, anio, calificacion, fecha_terminado FROM series WHERE id=%s;", (id,))
        serie = cur.fetchone()
        cur.close()
        conn.close()
    except Exception as e:
        flash(f"Error al obtener serie: {e}", "error")
        return redirect(url_for('series'))
    
    return render_template('editar_serie.html', serie=serie)

@app.route('/eliminar_serie/<int:id>', methods=['POST'])
def eliminar_serie(id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM series WHERE id=%s;", (id,))
        conn.commit()
        cur.close()
        conn.close()
        flash("Serie eliminada correctamente", "success")
    except Exception as e:
        flash(f"Error al eliminar serie: {e}", "error")
    
    return redirect(url_for('series'))

@app.route('/exportar')
def exportar():
    peliculas_count = 0
    series_count = 0
    
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM peliculas;")
        peliculas_count = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM series;")
        series_count = cur.fetchone()[0]
        cur.close()
        conn.close()
    except Exception as e:
        flash(f"Error al obtener conteos: {e}", "error")
    
    return render_template('exportar.html', 
                         peliculas_count=peliculas_count, 
                         series_count=series_count)

@app.route('/exportar_peliculas')
def exportar_peliculas():
    try:
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
        
        output.seek(0)
        return send_file(
            output,
            as_attachment=True,
            download_name='peliculas_exportadas.csv',
            mimetype='text/csv'
        )
    except Exception as e:
        flash(f"Error al exportar películas: {e}", "error")
        return redirect(url_for('exportar'))

@app.route('/exportar_series')
def exportar_series():
    try:
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
        
        output.seek(0)
        return send_file(
            output,
            as_attachment=True,
            download_name='series_exportadas.csv',
            mimetype='text/csv'
        )
    except Exception as e:
        flash(f"Error al exportar series: {e}", "error")
        return redirect(url_for('exportar'))

@app.route('/exportar_todo')
def exportar_todo():
    try:
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
        
        output.seek(0)
        return send_file(
            output,
            as_attachment=True,
            download_name='biblioteca_completa.csv',
            mimetype='text/csv'
        )
    except Exception as e:
        flash(f"Error al exportar datos: {e}", "error")
        return redirect(url_for('exportar'))

@app.route('/buscar')
def buscar():
    query = request.args.get('q', '').strip()
    if not query:
        return redirect(url_for('index'))
    
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

if __name__ == '__main__':
    app.run(debug=True, port=5002)
