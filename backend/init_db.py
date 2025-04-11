import os
import random
import psycopg2
from dotenv import load_dotenv
load_dotenv()

conn = psycopg2.connect(
        host="localhost",
        database="potatodb",
        user=os.environ['DB_USERNAME'],
        password=os.environ['DB_PASSWORD'])

# Open a cursor to perform database operations
cur = conn.cursor()

# Execute a command: this creates a new table
cur.execute('DROP TABLE IF EXISTS _box;')
cur.execute('''
    CREATE TABLE _box (
        _entryID SERIAL PRIMARY KEY,
        _boxID INTEGER NOT NULL,
        _ambientTemperature NUMERIC(5,2) NOT NULL,
        _averageTemperature NUMERIC(5,2) NOT NULL,
        _targetTemperature NUMERIC(5,2) NOT NULL,
        _currentVoltage INTEGER NOT NULL,
        _timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
''')

# Insert fake data for each box over 10 time steps
for i in range(10):
    for box_id in range(1, 5):
        ambient = round(random.uniform(18.0, 22.0), 2)
        average = round(random.uniform(20.0, 25.0), 2)
        target = 23.00
        voltage = random.randint(110, 130)

        cur.execute('''
            INSERT INTO _box (_boxID, _ambientTemperature, _averageTemperature, _targetTemperature, _currentVoltage)
            VALUES (%s, %s, %s, %s, %s);
        ''', (box_id, ambient, average, target, voltage))


conn.commit()

cur.close()
conn.close()