from flask import Blueprint, render_template, flash
import app.models.pelicula as pelicula_model
import app.models.serie as serie_model
from app.services.export import (
    exportar_peliculas_csv, exportar_series_csv, exportar_todo_csv,
    exportar_peliculas_json, exportar_series_json, exportar_todo_json
)

exportar_bp = Blueprint('exportar', __name__)

@exportar_bp.route('/exportar')
def index():
    peliculas_count = pelicula_model.contar()
    series_count = serie_model.contar()
    return render_template('exportar/index.html',
                         peliculas_count=peliculas_count,
                         series_count=series_count)

@exportar_bp.route('/exportar_peliculas_csv')
def peliculas_csv():
    return exportar_peliculas_csv()

@exportar_bp.route('/exportar_series_csv')
def series_csv():
    return exportar_series_csv()

@exportar_bp.route('/exportar_todo_csv')
def todo_csv():
    return exportar_todo_csv()

@exportar_bp.route('/exportar_peliculas_json')
def peliculas_json():
    return exportar_peliculas_json()

@exportar_bp.route('/exportar_series_json')
def series_json():
    return exportar_series_json()

@exportar_bp.route('/exportar_todo_json')
def todo_json():
    return exportar_todo_json()
