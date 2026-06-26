from flask import jsonify, request
from flask_restful import Resource
from io import BytesIO
from PIL import Image
import api.models.serie as serie_model

class SerieList(Resource):
    def get(self):
        series = serie_model.obtener_todas()
        anios = serie_model.obtener_anios()
        
        result = []
        for s in series:
            result.append({
                'id': s[0],
                'nombre': s[1],
                'anio': s[2],
                'calificacion': float(s[3]) if s[3] else None,
                'fecha_terminado': str(s[4]) if s[4] else None,
                'tiene_imagen': s[5]
            })
        
        return jsonify({
            'series': result,
            'anios': anios,
            'total': len(result)
        })

    def post(self):
        data = request.get_json()
        
        if not data or not data.get('nombre'):
            return {'error': 'El nombre es requerido'}, 400
        
        try:
            serie_id = serie_model.crear(
                nombre=data['nombre'],
                anio=data.get('anio'),
                calificacion=data.get('calificacion'),
                fecha_terminado=data.get('fecha_terminado')
            )
            return {'id': serie_id, 'message': 'Serie creada exitosamente'}, 201
        except Exception as e:
            return {'error': str(e)}, 500

class SerieResource(Resource):
    def get(self, id):
        serie = serie_model.obtener_por_id(id)
        if not serie:
            return {'error': 'Serie no encontrada'}, 404
        
        return jsonify({
            'id': serie[0],
            'nombre': serie[1],
            'anio': serie[2],
            'calificacion': float(serie[3]) if serie[3] else None,
            'fecha_terminado': str(serie[4]) if serie[4] else None,
            'tiene_imagen': serie[5]
        })

    def put(self, id):
        serie = serie_model.obtener_por_id(id)
        if not serie:
            return {'error': 'Serie no encontrada'}, 404
        
        data = request.get_json()
        
        try:
            serie_model.actualizar(
                id=id,
                nombre=data.get('nombre', serie[1]),
                anio=data.get('anio', serie[2]),
                calificacion=data.get('calificacion', serie[3]),
                fecha_terminado=data.get('fecha_terminado', serie[4])
            )
            return {'message': 'Serie actualizada exitosamente'}
        except Exception as e:
            return {'error': str(e)}, 500

    def delete(self, id):
        serie = serie_model.obtener_por_id(id)
        if not serie:
            return {'error': 'Serie no encontrada'}, 404
        
        try:
            serie_model.eliminar(id)
            return {'message': 'Serie eliminada exitosamente'}
        except Exception as e:
            return {'error': str(e)}, 500

class SerieImagen(Resource):
    def get(self, id):
        imagen = serie_model.obtener_imagen(id)
        if not imagen:
            return {'error': 'Imagen no encontrada'}, 404
        
        from flask import Response
        return Response(imagen, mimetype='image/jpeg')

    def post(self, id):
        serie = serie_model.obtener_por_id(id)
        if not serie:
            return {'error': 'Serie no encontrada'}, 404
        
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
            
            serie_model.guardar_imagen(id, imagen_bytes)
            return {'message': 'Imagen guardada exitosamente'}
        except Exception as e:
            return {'error': f'Error al procesar imagen: {str(e)}'}, 500

class SerieBuscar(Resource):
    def get(self):
        query = request.args.get('q', '').strip()
        if not query:
            return {'error': 'Parámetro de búsqueda requerido'}, 400
        
        series = serie_model.buscar(query)
        
        result = []
        for s in series:
            result.append({
                'id': s[0],
                'nombre': s[1],
                'anio': s[2],
                'calificacion': float(s[3]) if s[3] else None,
                'fecha_terminado': str(s[4]) if s[4] else None
            })
        
        return jsonify({'series': result, 'total': len(result)})
