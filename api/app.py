from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from api.config import SECRET_KEY
from api.routes.peliculas import PeliculaList, PeliculaResource, PeliculaImagen, PeliculaBuscar
from api.routes.series import SerieList, SerieResource, SerieImagen, SerieBuscar
from api.routes.exportar import (
    StatsResource,
    ExportPeliculasCSV, ExportSeriesCSV, ExportTodoCSV,
    ExportPeliculasJSON, ExportSeriesJSON, ExportTodoJSON
)

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = SECRET_KEY
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
    
    CORS(app)
    
    api = Api(app)
    
    api.add_resource(PeliculaList, '/api/peliculas')
    api.add_resource(PeliculaResource, '/api/peliculas/<int:id>')
    api.add_resource(PeliculaImagen, '/api/peliculas/<int:id>/imagen')
    api.add_resource(PeliculaBuscar, '/api/peliculas/buscar')
    
    api.add_resource(SerieList, '/api/series')
    api.add_resource(SerieResource, '/api/series/<int:id>')
    api.add_resource(SerieImagen, '/api/series/<int:id>/imagen')
    api.add_resource(SerieBuscar, '/api/series/buscar')
    
    api.add_resource(StatsResource, '/api/stats')
    
    api.add_resource(ExportPeliculasCSV, '/api/export/peliculas/csv')
    api.add_resource(ExportSeriesCSV, '/api/export/series/csv')
    api.add_resource(ExportTodoCSV, '/api/export/todo/csv')
    api.add_resource(ExportPeliculasJSON, '/api/export/peliculas/json')
    api.add_resource(ExportSeriesJSON, '/api/export/series/json')
    api.add_resource(ExportTodoJSON, '/api/export/todo/json')
    
    return app
