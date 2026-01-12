import mysql.connector
from mysql.connector import Error

def execute_sql_file(host, user, password, database, sql_file_path):
    try:
        # Connect to MySQL server (without specifying database initially)
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password
        )

        if connection.is_connected():
            cursor = connection.cursor()

            # Create database if it doesn't exist
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database}")
            print(f"Database '{database}' created or already exists.")

            # Switch to the database
            cursor.execute(f"USE {database}")

            # Read and execute the SQL file
            with open(sql_file_path, 'r', encoding='utf-8') as file:
                sql_script = file.read()

            # Split the script into individual statements
            statements = sql_script.split(';')

            for statement in statements:
                statement = statement.strip()
                if statement and not statement.startswith('--'):
                    try:
                        cursor.execute(statement)
                        print(f"Executed: {statement[:50]}...")
                    except Error as e:
                        print(f"Error executing statement: {e}")
                        print(f"Statement: {statement}")

            connection.commit()
            print("Database schema setup completed successfully.")

    except Error as e:
        print(f"Error: {e}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    # Database configuration
    HOST = "localhost"
    USER = "root"
    PASSWORD = "Abhijeet@7654"
    DATABASE = "attendance_system"
    SQL_FILE_PATH = "Backend/database_schema.sql"

    execute_sql_file(HOST, USER, PASSWORD, DATABASE, SQL_FILE_PATH)
