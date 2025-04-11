from flask import Flask, jsonify
from flask_cors import CORS
import serial
import csv
import threading
import os
import psycopg2

app = Flask(__name__)
cors = CORS(app, origins='*')

'''
    Sending data from each box every 15 seconds results in 23,040 data points per day.
    This is 161,280 data points per week.
    This is 686,400 data points per month.

    Should look into indexing the table for faster queries. I'm worried about Raspberry Pi's ablity to handle the data.
'''

def getDBConnection():
    conn = psycopg2.connect(
        host="localhost",
        database="potatoDB",
        user=os.environ['DB_USERNAME'],
        password=os.environ['DB_PASSWORD'])
    return conn

def addData(boxID, avgerageTemperature, ambientTemperature, targetTemperature, currentVoltage):
    conn = getDBConnection()
    cur = conn.cursor()
    cur.execute('INSERT INTO _box (_boxID, _ambientTemperature, _averageTemperature, _targetTemperature, _currentVoltage)'
                'VALUES (%s, %s, %s, %s, %s)',
                (boxID,
                ambientTemperature,
                 avgerageTemperature,
                 targetTemperature,
                 currentVoltage)
                )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"status": "success"}), 200

@app.route("/getData/<int:boxID>/<int:limit>", methods=['GET'])
def getData(boxID, limit=10):
    print(f"BoxID: {boxID}, Limit: {limit}")
    conn = getDBConnection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM _box WHERE _boxID = %s ORDER BY _timestamp DESC LIMIT %s', (boxID, limit))
    rows = cur.fetchall()
    data = []
    for row in rows:
        data.append({
            "_entryID": row[0],
            "_boxID": row[1],
            "_ambientTemperature": row[2],
            "_averageTemperature": row[3],
            "_targetTemperature": row[4],
            "_currentVoltage": row[5],
            "_sensor1": row[6],
            "_sensor2": row[7],
            "_sensor3": row[8],
            "_sensor4": row[9],
            "_timestamp": row[10]
        })
    cur.close()
    conn.close()
    return jsonify(data), 200

def main():

    # Start the data receiving thread before running Flask
    t1 = threading.Thread(target=lambda: app.run(debug=True, port=8080, use_reloader=False))
    t1.start()

    recieveData()


def recieveData():
    with serial.Serial('/dev/ttyS0', 9600, timeout=1) as ser:
        with open('temp1.csv', 'a', newline='') as csvfile:
            csv_writer = csv.writer(csvfile)
            while True:
                if ser.in_waiting:
                    data = ser.readline().decode('utf-8').strip()
                    print(f"Data: {data}")
                    parameters = data.split('=')[1]
                    parameters = parameters.split(',')
                    print(parameters)
                    # Address - Data Length -- ASCII Data -- Signal Strength(RSSI) -- Signal-to-noise ratio
                    # BoxID | Average Temperature | Ambient Temperature | Target Temperature | Current Voltage
                    # 0       1                   2                     3                     4
                    parameters = parameters[2].split('|')
                    boxID = parameters[0]
                    avgT = parameters[1]
                    ambientT = parameters[2]
                    targetT = parameters[3]
                    currentV = parameters[4]
                    addData(boxID, avgT, ambientT, targetT, currentV)

main()