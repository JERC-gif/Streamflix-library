import os
import click
from api.app import create_app

@click.command()
@click.option('--host', default='0.0.0.0', help='Host del servidor')
@click.option('--port', default=5002, help='Puerto del servidor')
@click.option('--debug/--no-debug', default=True, help='Modo debug')
def run(host, port, debug):
    app = create_app()
    app.run(host=host, port=port, debug=debug)

if __name__ == '__main__':
    run()
