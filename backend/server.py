from flask import Flask, jsonify
from flask_cors import CORS
import serial
import threading
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
cors = CORS(app, origins='*')

serial_lock = threading.Lock()
ser = serial.Serial('/dev/ttyS0', 9600, timeout=1)

boxIDtoLoraAddress = {1:9, 2:18, 3:27, 4:36} # Box 1 is Lora Address 9

'''
    Sending data from each box every 15 seconds results in 23,040 data points per day.
    This is 161,280 data points per week.
    This is 686,400 data points per month.

    Should look into indexing the table for faster queries. I'm worried about Raspberry Pi's ablity to handle the data.
'''

def getDBConnection():
    conn = psycopg2.connect(
        host="localhost",
        database="potatodb",
        user=os.environ['DB_USERNAME'],
        password=os.environ['DB_PASSWORD'])
    return conn

def addData(boxID, avgerageTemperature, ambientTemperature, delta, currentVoltage, sensor1, sensor2, sensor3, sensor4):
    conn = getDBConnection()
    cur = conn.cursor()
    cur.execute('INSERT INTO _box (_boxID, _ambientTemperature, _averageTemperature, _delta, _currentVoltage, _sensor1, _sensor2, _sensor3, _sensor4)'
                'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)',
                (boxID,
                ambientTemperature,
                 avgerageTemperature,
                 delta,
                 currentVoltage,
                 sensor1,
                 sensor2,
                 sensor3,
                 sensor4)
                )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"status": "success"}), 200

@app.route("/")
def hello():
    return "<h1 style='color:blue'>Hello There!</h1>"

@app.route("/changeDelta/<int:boxID>/<int:delta>", methods=['POST'])
def changeDelta(boxID, delta):
    if delta < 0 or delta > 30: # Delta can only be in range of 0-30
        return jsonify({"status": "error", "message": "Delta out of range"}), 400
    content = 'D' + str(delta)
    sendLoraMessage(boxID, content)
    return jsonify({"status": "sent"}), 200

@app.route("/changeVoltage/<int:boxID>/<int:voltage>", methods=['POST'])
def changeVoltage(boxID, voltage):
    if voltage < 0 or voltage > 130: # Voltage can be 0-130
        return jsonify({"status": "error", "message": "Delta out of range"}), 400
    content = 'V' + str(voltage)
    sendLoraMessage(boxID, content)
    return jsonify({"status": "sent"}), 200

def sendLoraMessage(boxID, content):
    loraAddress = None
    try:
        loraAddress = boxIDtoLoraAddress[boxID]
    except:
        print("Error: Box ID matched to Lora Address")
        return
    message = f"AT+SEND={loraAddress},{len(content)},{content}\r\n"
    with serial_lock:
        ser.write(message.encode('utf-8'))
    print(f"[TX] Sent: {message}")

@app.route("/getData/<int:boxID>/<int:limit>", methods=['GET'])
def getData(boxID, limit=10):
    print(f"BoxID: {boxID}, Limit: {limit}")
    conn = getDBConnection()
    cur = conn.cursor()
    if limit == 0:
        cur.execute('SELECT * FROM _box WHERE _boxID = %s ORDER BY _timestamp DESC', (boxID))
    else:
        cur.execute('SELECT * FROM _box WHERE _boxID = %s ORDER BY _timestamp DESC LIMIT %s', (boxID, limit))
    rows = cur.fetchall()
    data = []
    for row in rows:
        data.append({
            "_entryID": row[0],
            "_boxID": row[1],
            "_ambientTemperature": row[2],
            "_averageTemperature": row[3],
            "_delta": row[4],
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

# def main():
#     # Start the data receiving thread before running Flask
#     # t1 = threading.Thread(target=lambda: app.run(host="0.0.0.0", use_reloader=False))
#     # t1.start()

#     recieveData()

def recieveData():
    while True:
        data = None
        with serial_lock:
            if ser.in_waiting:
                print("getting data")
                data = ser.readline().decode('utf-8').strip()
        if data == None:
            continue
        print(f"Data: {data}")
        try:
            if not data.startswith('+RCV'):
                continue
            parts = data.split('=')[1].split(',')
            if len(parts) < 3:
                continue
            sensorData = parts[2].split('|')
            if len(sensorData) < 9:
                continue
            # Address - Data Length -- ASCII Data -- Signal Strength(RSSI) -- Signal-to-noise ratio
            # BoxID | Average Temperature | Ambient Temperature | Delta (how many degrees difference from ambient) | Current Voltage | Sensor1 | Sensor2 | Sensor3 | Sensor4
            # 0       1                   2                     3                     4
            print(f"Parameters: {sensorData}")
            boxID = sensorData[0]
            avgT = sensorData[1]
            ambientT = sensorData[2]
            delta = sensorData[3]
            currentV = sensorData[4]
            sensor1 = sensorData[5]
            sensor2 = sensorData[6]
            sensor3 = sensorData[7]
            sensor4 = sensorData[8]
            with app.app_context():
                addData(boxID, avgT, ambientT, delta, currentV, sensor1, sensor2, sensor3, sensor4)
        except Exception as e:
            print(f"Error: {e}")

# main()