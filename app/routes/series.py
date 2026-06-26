from flask import Blueprint, render_template, request, redirect, url_for, flash
import app.models.serie as serie_model

series_bp = Blueprint('series', __name__)

@series_bp.route('/series')
def listar():
    series = serie_model.obtener_todas()
    anios = serie_model.obtener_anios()
    return render_template('series/listar.html', series=series, anios=anios)

@series_bp.route('/agregar_serie', methods=['POST'])
def agregar():
    nombre = request.form['nombre']
    anio = request.form['anio'] or None
    calificacion = request.form['calificacion'] or None
    fecha_terminado = request.form['fecha_terminado'] or None

    try:
        serie_id = serie_model.crear(nombre, anio, calificacion, fecha_terminado)
        flash(f"Serie '{nombre}' registrada con ID {serie_id}", "success")
    except Exception as e:
        flash(f"Error al agregar serie: {e}", "error")

    return redirect(url_for('series.listar'))

@series_bp.route('/editar_serie/<int:id>', methods=['GET', 'POST'])
def editar(id):
    if request.method == 'POST':
        nombre = request.form['nombre']
        anio = request.form['anio'] or None
        calificacion = request.form['calificacion'] or None
        fecha_terminado = request.form['fecha_terminado'] or None

        try:
            serie_model.actualizar(id, nombre, anio, calificacion, fecha_terminado)
            flash(f"Serie '{nombre}' actualizada", "success")
        except Exception as e:
            flash(f"Error al actualizar serie: {e}", "error")

        return redirect(url_for('series.listar'))

    serie = serie_model.obtener_por_id(id)
    if not serie:
        flash("Serie no encontrada", "error")
        return redirect(url_for('series.listar'))

    return render_template('series/editar.html', serie=serie)

@series_bp.route('/eliminar_serie/<int:id>', methods=['POST'])
def eliminar(id):
    try:
        serie_model.eliminar(id)
        flash("Serie eliminada correctamente", "success")
    except Exception as e:
        flash(f"Error al eliminar serie: {e}", "error")

    return redirect(url_for('series.listar'))
