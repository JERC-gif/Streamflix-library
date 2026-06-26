import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

def get_connection():
    """Devuelve una conexión activa a la base de datos."""
    return psycopg2.connect(DATABASE_URL)
