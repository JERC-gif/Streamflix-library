from flask import jsonify
from flask_restful import Resource
import api.models.pelicula as pelicula_model
import api.models.serie as serie_model
from api.services.export import (
    exportar_peliculas_csv, exportar_series_csv, exportar_todo_csv,
    exportar_peliculas_json, exportar_series_json, exportar_todo_json
)
from flask import Response

class StatsResource(Resource):
    def get(self):
        peliculas_count = pelicula_model.contar()
        series_count = serie_model.contar()
        
        return jsonify({
            'peliculas_count': peliculas_count,
            'series_count': series_count,
            'total': peliculas_count + series_count
        })

class ExportPeliculasCSV(Resource):
    def get(self):
        csv_data = exportar_peliculas_csv()
        return Response(
            csv_data,
            mimetype='text/csv',
            headers={'Content-Disposition': 'attachment; filename=peliculas_exportadas.csv'}
        )

class ExportSeriesCSV(Resource):
    def get(self):
        csv_data = exportar_series_csv()
        return Response(
            csv_data,
            mimetype='text/csv',
            headers={'Content-Disposition': 'attachment; filename=series_exportadas.csv'}
        )

class ExportTodoCSV(Resource):
    def get(self):
        csv_data = exportar_todo_csv()
        return Response(
            csv_data,
            mimetype='text/csv',
            headers={'Content-Disposition': 'attachment; filename=biblioteca_completa.csv'}
        )

class ExportPeliculasJSON(Resource):
    def get(self):
        json_data = exportar_peliculas_json()
        return Response(
            json_data,
            mimetype='application/json',
            headers={'Content-Disposition': 'attachment; filename=peliculas_exportadas.json'}
        )

class ExportSeriesJSON(Resource):
    def get(self):
        json_data = exportar_series_json()
        return Response(
            json_data,
            mimetype='application/json',
            headers={'Content-Disposition': 'attachment; filename=series_exportadas.json'}
        )

class ExportTodoJSON(Resource):
    def get(self):
        json_data = exportar_todo_json()
        return Response(
            json_data,
            mimetype='application/json',
            headers={'Content-Disposition': 'attachment; filename=biblioteca_completa.json'}
        )
