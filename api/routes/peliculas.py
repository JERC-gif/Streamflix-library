from flask import jsonify, request
from flask_restful import Resource
from io import BytesIO
from PIL import Image
import api.models.pelicula as pelicula_model

class PeliculaList(Resource):
    def get(self):
        peliculas = pelicula_model.obtener_todas()
        anios = pelicula_model.obtener_anios()
        
        result = []
        for p in peliculas:
            result.append({
                'id': p[0],
                'nombre': p[1],
                'anio': p[2],
                'calificacion': float(p[3]) if p[3] else None,
                'fecha_vista': str(p[4]) if p[4] else None,
                'tiene_imagen': p[5]
            })
        
        return jsonify({
            'peliculas': result,
            'anios': anios,
            'total': len(result)
        })

    def post(self):
        data = request.get_json()
        
        if not data or not data.get('nombre'):
            return {'error': 'El nombre es requerido'}, 400
        
        try:
            pelicula_id = pelicula_model.crear(
                nombre=data['nombre'],
                anio=data.get('anio'),
                calificacion=data.get('calificacion'),
                fecha_vista=data.get('fecha_vista')
            )
            return {'id': pelicula_id, 'message': 'Película creada exitosamente'}, 201
        except Exception as e:
            return {'error': str(e)}, 500

class PeliculaResource(Resource):
    def get(self, id):
        pelicula = pelicula_model.obtener_por_id(id)
        if not pelicula:
            return {'error': 'Película no encontrada'}, 404
        
        return jsonify({
            'id': pelicula[0],
            'nombre': pelicula[1],
            'anio': pelicula[2],
            'calificacion': float(pelicula[3]) if pelicula[3] else None,
            'fecha_vista': str(pelicula[4]) if pelicula[4] else None,
            'tiene_imagen': pelicula[5]
        })

    def put(self, id):
        pelicula = pelicula_model.obtener_por_id(id)
        if not pelicula:
            return {'error': 'Película no encontrada'}, 404
        
        data = request.get_json()
        
        try:
            pelicula_model.actualizar(
                id=id,
                nombre=data.get('nombre', pelicula[1]),
                anio=data.get('anio', pelicula[2]),
                calificacion=data.get('calificacion', pelicula[3]),
                fecha_vista=data.get('fecha_vista', pelicula[4])
            )
            return {'message': 'Película actualizada exitosamente'}
        except Exception as e:
            return {'error': str(e)}, 500

    def delete(self, id):
        pelicula = pelicula_model.obtener_por_id(id)
        if not pelicula:
            return {'error': 'Película no encontrada'}, 404
        
        try:
            pelicula_model.eliminar(id)
            return {'message': 'Película eliminada exitosamente'}
        except Exception as e:
            return {'error': str(e)}, 500

class PeliculaImagen(Resource):
    def get(self, id):
        imagen = pelicula_model.obtener_imagen(id)
        if not imagen:
            return {'error': 'Imagen no encontrada'}, 404
        
        from flask import Response
        return Response(imagen, mimetype='image/jpeg')

    def post(self, id):
        pelicula = pelicula_model.obtener_por_id(id)
        if not pelicula:
            return {'error': 'Película no encontrada'}, 404
        
        if 'imagen' not in request.files:
            return {'error': 'No se proporcionó imagen'}, 400
        
        file = request.files['imagen']
        
        try:
            img = Image.open(file)
            img = img.convert('RGB')
            img.thumbnail((800, 800))
            
            buffer = BytesIO()
            img.save(buffer, format='JPEG', quality=85)
            imagen_bytes = buffer.getvalue()
            
            pelicula_model.guardar_imagen(id, imagen_bytes)
            return {'message': 'Imagen guardada exitosamente'}
        except Exception as e:
            return {'error': f'Error al procesar imagen: {str(e)}'}, 500

class PeliculaBuscar(Resource):
    def get(self):
        query = request.args.get('q', '').strip()
        if not query:
            return {'error': 'Parámetro de búsqueda requerido'}, 400
        
        peliculas = pelicula_model.buscar(query)
        
        result = []
        for p in peliculas:
            result.append({
                'id': p[0],
                'nombre': p[1],
                'anio': p[2],
                'calificacion': float(p[3]) if p[3] else None,
                'fecha_vista': str(p[4]) if p[4] else None
            })
        
        return jsonify({'peliculas': result, 'total': len(result)})
