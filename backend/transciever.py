import threading
import serial
import os
import psycopg2
import requests
from dotenv import load_dotenv

load_dotenv()
ser = serial.Serial('/dev/ttyS0', 9600, timeout=1)
serial_lock = threading.Lock()
boxIDtoLoraAddress = {1:9, 2:18} # Box 1 is Lora Address 9

def getDBConnection():
    conn = psycopg2.connect(
        host="localhost",
        database="potatodb",
        user=os.environ['DB_USERNAME'],
        password=os.environ['DB_PASSWORD'])
    return conn

def pushToThingSpeak(boxId, avgT, ambientT, delta, currentV, s1, s2, s3, s4):
    try:
        api_key = ''
        match boxId:
            case 1:
                os.getenv("THINGSPEAK_API_WRITE_KEY1")
            case 2:
                os.getenv("THINGSPEAK_API_WRITE_KEY2")
            case 3:
                os.getenv("THINGSPEAK_API_WRITE_KEY3")
            case 4:
                os.getenv("THINGSPEAK_API_WRITE_KEY4")
        url = os.getenv("THINGSPEAK_URL")

        payload = {
            'api_key': api_key,
            'field1': ambientT,
            'field2': avgT,
            'field3': delta,
            'field4': currentV,
            'field5': s1,
            'field6': s2,
            'field7': s3,
            'field8': s4
        }

        response = requests.get(url, params=payload)
        if response.status_code != 200:
            print(f"ThingSpeak error: {response.status_code} - {response.text}")
        else:
            print(f"ThingSpeak update ID: {response.text}")
    except Exception as e:
        print(f"Failed to send to ThingSpeak: {e}")

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
            addData(boxID, avgT, ambientT, delta, currentV, sensor1, sensor2, sensor3, sensor4)
            pushToThingSpeak(boxID, avgT, ambientT, delta, currentV, sensor1, sensor2, sensor3, sensor4)
        except Exception as e:
            print(f"Error: {e}")

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
    return;

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

def main():
    recieveData()

if __name__ == "__main__":
    main()