import { useEffect, useState } from "react";
import DataGraph from "./datagraph";
import axios from "axios";

interface BoxProps {
  id: number;
}

function Box({ id }: BoxProps) {
  const [averageTemperature, setAverageTemperature] = useState(0.0);
  const [ambientTemperature, setAmbientTemperature] = useState(0.0);
  const [targetTemperature, setTargetTemperature] = useState(0.0);
  const [currentVoltage, setCurrentVoltage] = useState(0.0);

  const [sensor1, setSensor1] = useState(0.0);
  const [sensor2, setSensor2] = useState(0.0);
  const [sensor3, setSensor3] = useState(0.0);
  const [sensor4, setSensor4] = useState(0.0);

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8080/getData/" + id + "/1");
      const latest = response.data[0];
      setAverageTemperature(parseFloat(latest._averageTemperature));
      setAmbientTemperature(parseFloat(latest._ambientTemperature));
      setTargetTemperature(parseFloat(latest._targetTemperature));
      setCurrentVoltage(latest._currentVoltage);

      setSensor1(latest._sensor1);
      setSensor2(latest._sensor2);
      setSensor3(latest._sensor3);
      setSensor4(latest._sensor4);
    } catch (err) {
      console.error("Error fetching box data:", err);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <div className="w-full h-full p-5 bg-black border-1 border-white">
      <h2 className="text-xl text-white font-bold text-center mb-3">
        Box {id}
      </h2>
      <div className="flex flex-row">
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row justify-start">
            <p className="text-white w-18">Average</p>
            <p className="text-green-500">{averageTemperature} °F</p>
          </div>
          <div className="flex flex-row justify-start">
            <p className="text-white w-18">Ambient</p>
            <p className="text-green-500">{ambientTemperature} °F</p>
          </div>
          <div className="flex flex-row justify-start">
            <p className="text-white w-18">Target</p>
            <p className="text-green-500">{targetTemperature} °F</p>
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
        </div>
      </div>
    </div>
  );
}

export default Box;
