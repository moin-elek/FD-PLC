import json, time, random
import numpy as np

from datetime import datetime
from numpy.core.defchararray import add
from numpy.matrixlib.defmatrix import matrix
from pymodbus.client.sync import ModbusTcpClient
from pymodbus.constants import Endian
from pymodbus.payload import BinaryPayloadBuilder, BinaryPayloadDecoder
from flask import Flask, Response, render_template, request, url_for, redirect, jsonify, make_response

application = Flask(__name__)

@application.route("/")
def index():
    return render_template("overview.html")


def readData():
    client = ModbusTcpClient("169.254.0.0")
    client.connect()
    addressList = [28681, 28673, 28685, 28687, 28711, 28697]
    
    while True: 
        dataList = []
        for i in range(len(addressList)):
            result = client.read_holding_registers(addressList[i],2,unit=0)
            decoder = BinaryPayloadDecoder.fromRegisters(result.registers, byteorder= Endian.Big, wordorder= Endian.Big)
            dataList.append(decoder.decode_32bit_float())
        json_data = json.dumps(
            {
                "flowrateSP": dataList[0],
                "flowrate": dataList[1],
                "pressure1": dataList[2],
                "pressure2": dataList[3],
                "humiditySP": dataList[4],
                "humidity": dataList[5],
            }
        )
        yield f"data:{json_data}\n\n"
        time.sleep(1)

@application.route("/chart-data")
def chart_data():
    return Response(readData(), mimetype="text/event-stream")

@application.route("/flowrateSend", methods=['POST'])
def sentData():

    modbus_obj = ModbusTcpClient("169.254.0.0")
    req = request.get_json()
    print(req)
    try:
        numwrite = float(req["flowrates"])
        print(numwrite)
        builder = BinaryPayloadBuilder(byteorder=Endian.Big, wordorder=Endian.Big)
        builder.add_32bit_float(numwrite)
        registers = builder.to_registers()
        modbus_obj.write_registers(28681, registers, unit=0)
    except:
        print('bad update')

    res = make_response(jsonify({"message":"JSON recieved"}), 200)
    
    return res

@application.route("/rhSend", methods=['POST'])
def sentRH():
    modbus_obj = ModbusTcpClient("169.254.0.0")
    req = request.get_json()
    print(req)

    try:
        numwrite = float(req["rh"])
        print(numwrite)
        builder = BinaryPayloadBuilder(byteorder=Endian.Big, wordorder=Endian.Big)
        builder.add_32bit_float(numwrite)
        registers = builder.to_registers()
        modbus_obj.write_registers(28711, registers, unit=0)  
    except:
        print('bad update')
    
    res = make_response(jsonify({"message": "JSON recieved"}), 200)
    return res

@application.route("/drying.html")
def index2():
    return render_template("drying.html")

if __name__ == "__main__":
    application.run(debug=True, threaded=True, host="0.0.0.0", port=5000)