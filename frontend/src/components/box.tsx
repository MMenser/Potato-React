import { useEffect, useState } from "react";
import DataGraph from "./datagraph";
import axios from "axios";

interface DataRow {
  _entryId: number;
  _boxId: number;
  _ambientTemperature: number;
  _averageTemperature: number;
  _delta: number;
  _currentVoltage: number;
  _sensor1: number;
  _sensor2: number;
  _sensor3: number;
  _sensor4: number;
}

interface BoxProps {
  id: number;
}

function Box({ id }: BoxProps) {
  const [averageTemperature, setAverageTemperature] = useState(0.0);
  const [ambientTemperature, setAmbientTemperature] = useState(0.0);
  const [delta, setDelta] = useState(0);
  const [currentVoltage, setCurrentVoltage] = useState(0.0);
  const [exportTimeLimit, setExportTimeLimit] = useState(30);
  const [customTime, setCustomTime] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const [inputDelta, setInputDelta] = useState(0);

  const [sensor1, setSensor1] = useState(0.0);
  const [sensor2, setSensor2] = useState(0.0);
  const [sensor3, setSensor3] = useState(0.0);
  const [sensor4, setSensor4] = useState(0.0);

  const fetchAPI = async () => {
    try {
      const response = await axios.get(
        "http://10.109.202.69:8080/getData/" + id + "/1"
      );
      const latest = response.data[0];
      setAverageTemperature(parseFloat(latest._averageTemperature));
      setAmbientTemperature(parseFloat(latest._ambientTemperature));
      setDelta(parseFloat(latest._delta));
      setCurrentVoltage(latest._currentVoltage);

      setSensor1(latest._sensor1);
      setSensor2(latest._sensor2);
      setSensor3(latest._sensor3);
      setSensor4(latest._sensor4);
    } catch (err) {
      console.error("Error fetching box data:", err);
    }
  };

  const exportData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8080/getData/" + id + "/" + exportTimeLimit
      );
      const data = response.data;
      const headers = Object.keys(data[0]).join(",");
      const rows = (data as DataRow[]).map((row) =>
        Object.values(row)
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(",")
      );
      const csvContent = [headers, ...rows].join("\n");

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `box_${id}_data_${exportTimeLimit}min.csv`;
      document.body.appendChild(a); // required for Firefox
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const changeDelta = async () => {
    if (isNaN(inputDelta) || inputDelta < 0 || inputDelta > 30) {
      alert("Delta must be a number between 0 and 30.");
      return;
    }

    try {
      const res = await axios.post(
        `http://127.0.0.1:8080/changeDelta/${id}/${inputDelta}`
      );
      console.log("Response:", res.data);
      setDelta(inputDelta); // update local state
    } catch (err) {
      console.error("Error updating delta:", err);
      alert("Failed to update delta. Check console for more info.");
    }
  };

  const changeVoltage = async () => {
    if (isNaN(currentVoltage) || currentVoltage < 0 || currentVoltage > 130) {
      alert("Voltage must be a number between 0 and 130.");
      return;
    }

    try {
      const res = await axios.post(
        `http://127.0.0.1:8080/changeVoltage/${id}/${currentVoltage}`
      );
      console.log("Response:", res.data);
    } catch (err) {
      console.error("Error updating delta:", err);
      alert("Failed to update delta. Check console for more info.");
    }
  }

  useEffect(() => {
    fetchAPI();
    setInputDelta(delta);
  }, []);

  return (
    <div className="w-full h-full p-5 bg-black border-1 border-white">
      <h2 className="text-xl text-white font-bold text-center mb-3">
        Box {id}
      </h2>
      <div className="flex flex-row">
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row items-center space-x-2">
            <select
              value={isCustom ? "custom" : exportTimeLimit}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "custom") {
                  setIsCustom(true);
                  setExportTimeLimit(0);
                } else {
                  setIsCustom(false);
                  setExportTimeLimit(Number(value));
                }
              }}
              className="w-28 bg-gray-700 text-white rounded px-2 py-1"
            >
              <option value={30}>Last 30 Min</option>
              <option value={720}>Last 12 Hr</option>
              <option value={0}>All</option>
              <option value="custom">Custom...</option>
            </select>

            {isCustom && (
              <input
                type="number"
                min={1}
                placeholder="Minutes"
                value={customTime}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCustomTime(e.target.value);
                  setExportTimeLimit(val);
                }}
                className="bg-gray-700 text-white rounded px-2 py-1 w-28 text-center"
              />
            )}
            <button
              type="button"
              onClick={exportData}
              className="w-36 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Export
            </button>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <input
              type="number"
              step="1.0"
              value={inputDelta}
              onChange={(e) => setInputDelta(parseFloat(e.target.value))}
              className="bg-gray-700 text-white rounded px-2 py-1 w-28 text-center"
            />
            <button
              type="button"
              onClick={changeDelta}
              className="w-36 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Change Delta
            </button>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <input
              type="number"
              step="1.0"
              value={inputDelta}
              onChange={(e) => setCurrentVoltage(parseFloat(e.target.value))}
              className="bg-gray-700 text-white rounded px-2 py-1 w-28 text-center"
            />
            <button
              type="button"
              onClick={changeVoltage}
              className="w-36 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Align Voltage
            </button>
          </div>
          <div className="flex flex-row justify-start">
            <p className="text-white w-18">Average</p>
            <p className="text-green-500">{averageTemperature} °F</p>
          </div>
          <div className="flex flex-row justify-start">
            <p className="text-white w-18">Ambient</p>
            <p className="text-green-500">{ambientTemperature} °F</p>
          </div>
          <div className="flex flex-row justify-start">
            <p className="text-white w-18">Delta</p>
            <p className="text-green-500">{delta} °F</p>
          </div>
          <div className="flex flex-row justify-start">
            <p className="text-white w-18">Voltage</p>
            <p className="text-green-500">{currentVoltage} V</p>
          </div>
          <div className="flex flex-row justify-start">
            <p className="text-white w-18">Sensor 1</p>
            <p className="text-green-500">{sensor1} °F</p>
          </div>
          <div className="flex flex-row justify-start">
            <p className="text-white w-18">Sensor 2</p>
            <p className="text-green-500">{sensor2} °F</p>
          </div>
          <div className="flex flex-row justify-start">
            <p className="text-white w-18">Sensor 3</p>
            <p className="text-green-500">{sensor3} °F</p>
          </div>
          <div className="flex flex-row justify-start">
            <p className="text-white w-18">Sensor 4</p>
            <p className="text-green-500">{sensor4} °F</p>
          </div>
        </div>
        <div className="mx-12 w-3/4">
          <DataGraph id={id} whichGraph={0}></DataGraph>
          <DataGraph id={id} whichGraph={1}></DataGraph>
        </div>
      </div>
    </div>
  );
}

export default Box;
