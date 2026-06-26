import click
from flask import Flask
from app.config import SECRET_KEY
from app.routes.principal import principal_bp
from app.routes.peliculas import peliculas_bp
from app.routes.series import series_bp
from app.routes.exportar import exportar_bp

def create_app():
    app = Flask(__name__,
                static_folder='static',
                template_folder='templates')
    app.secret_key = SECRET_KEY

    app.register_blueprint(principal_bp)
    app.register_blueprint(peliculas_bp)
    app.register_blueprint(series_bp)
    app.register_blueprint(exportar_bp)

    return app

@click.command()
@click.option('--host', default='0.0.0.0', help='Host del servidor')
@click.option('--port', default=5002, help='Puerto del servidor')
@click.option('--debug/--no-debug', default=True, help='Modo debug')
def run(host, port, debug):
    app = create_app()
    app.run(host=host, port=port, debug=debug)

if __name__ == '__main__':
    run()
