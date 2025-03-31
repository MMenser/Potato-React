import React, { useEffect, useState } from 'react';
import DataGraph from './datagraph';
import axios
 from 'axios';

 interface BoxProps {
  id: number
 }

function Box({id}: BoxProps) {
    const [averageTemperature, setAverageTemperature] = useState(0.0);
    const [ambientTemperature, setAmbientTemperature] = useState(0.0);
    const [targetTemperature, setTargetTemperature] = useState(0.0);
    const [currentVoltage, setCurrentVoltage] = useState(0.0);
    
    const fetchAPI = async () => {
        const response = await axios.get("http://127.0.0.1:8080/data")
        setAverageTemperature(response.data.data[0]);
        setAmbientTemperature(response.data.data[1]);
        setTargetTemperature(response.data.data[2]);
        setCurrentVoltage(response.data.data[3]);
        console.log(response.data.data);
      };
    
      useEffect(() => {
        fetchAPI()
      },[]);

    return (
        <div className="w-full h-1/4 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-center mb-4">Box {id}</h2>
            <div className='flex-row flex'>
            <div className="w-1/12 h-1/2 bg-gray-300 p-2 mx-auto rounded-md shadow-inner">
                <p className="text-center">Average</p>
                <p className="text-center">{averageTemperature} F</p>
            </div>
            <div className="w-1/12 h-1/2 bg-gray-300 p-2 mx-auto rounded-md shadow-inner">
                <p className="text-center">Ambient</p>
                <p className="text-center">{ambientTemperature} F</p>
            </div>
            <div className="w-1/12 h-1/2 bg-gray-300 p-2 mx-auto rounded-md shadow-inner">
                <p className="text-center">Target</p>
                <p className="text-center">{targetTemperature} F</p>
            </div>
            <div className="w-1/12 h-1/2 bg-gray-300 p-2 mx-auto rounded-md shadow-inner">
                <p className="text-center">Current Voltage</p>
                <p className="text-center">{currentVoltage} F</p>
            </div>
            </div>

        </div>
    );
}

export default Box;
