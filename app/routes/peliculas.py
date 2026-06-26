from flask import Blueprint, render_template, request, redirect, url_for, flash
import app.models.pelicula as pelicula_model

peliculas_bp = Blueprint('peliculas', __name__)

@peliculas_bp.route('/peliculas')
def listar():
    peliculas = pelicula_model.obtener_todas()
    anios = pelicula_model.obtener_anios()
    return render_template('peliculas/listar.html', peliculas=peliculas, anios=anios)

@peliculas_bp.route('/agregar_pelicula', methods=['POST'])
def agregar():
    nombre = request.form['nombre']
    anio = request.form['anio'] or None
    calificacion = request.form['calificacion'] or None
    fecha_vista = request.form['fecha_vista'] or None

    try:
        pelicula_id = pelicula_model.crear(nombre, anio, calificacion, fecha_vista)
        flash(f"Película '{nombre}' registrada con ID {pelicula_id}", "success")
    except Exception as e:
        flash(f"Error al agregar película: {e}", "error")

    return redirect(url_for('peliculas.listar'))

@peliculas_bp.route('/editar_pelicula/<int:id>', methods=['GET', 'POST'])
def editar(id):
    if request.method == 'POST':
        nombre = request.form['nombre']
        anio = request.form['anio'] or None
        calificacion = request.form['calificacion'] or None
        fecha_vista = request.form['fecha_vista'] or None

        try:
            pelicula_model.actualizar(id, nombre, anio, calificacion, fecha_vista)
            flash(f"Película '{nombre}' actualizada", "success")
        except Exception as e:
            flash(f"Error al actualizar película: {e}", "error")

        return redirect(url_for('peliculas.listar'))

    pelicula = pelicula_model.obtener_por_id(id)
    if not pelicula:
        flash("Película no encontrada", "error")
        return redirect(url_for('peliculas.listar'))

    return render_template('peliculas/editar.html', pelicula=pelicula)

@peliculas_bp.route('/eliminar_pelicula/<int:id>', methods=['POST'])
def eliminar(id):
    try:
        pelicula_model.eliminar(id)
        flash("Película eliminada correctamente", "success")
    except Exception as e:
        flash(f"Error al eliminar película: {e}", "error")

    return redirect(url_for('peliculas.listar'))
