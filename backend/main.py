from flask import Flask, jsonify
from flask_cors import CORS
import serial
import csv
import threading

app = Flask(__name__)
cors = CORS(app, origins='*')
avgTemp = 0.0

@app.route("/data", methods=['GET'])
def data():
    return jsonify(
        {
            "data": [
                avgTemp
            ]
        }
    )


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
                    global avgTemp
                    avgTemp = parameters[2]

                    csv_writer.writerow(parameters)
                    print(f"Data written: {parameters}")

main()