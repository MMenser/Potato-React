from flask import Flask, jsonify
from flask_cors import CORS
import os
import psycopg2
from dotenv import load_dotenv
from transciever import sendLoraMessage

load_dotenv()
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
        database="potatodb",
        user=os.environ['DB_USERNAME'],
        password=os.environ['DB_PASSWORD'])
    return conn


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


@app.route("/getData/<int:boxID>/<int:limit>", methods=['GET'])
def getData(boxID, limit=10):
    print(f"BoxID: {boxID}, Limit: {limit}")
    conn = getDBConnection()
    cur = conn.cursor()
    if limit == 99:
        cur.execute('SELECT * FROM _box WHERE _boxID = %s ORDER BY _timestamp DESC', ([boxID]))
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