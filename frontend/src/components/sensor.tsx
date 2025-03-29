import React, { useEffect, useState } from 'react';
import DataGraph from './datagraph';
import axios
 from 'axios';

function Sensor() {
    const [averageTemperature, setAverageTemperature] = useState(0.0);
    
    const fetchAPI = async () => {
        const response = await axios.get("http://127.0.0.1:8080/data")
        setAverageTemperature(response.data.data[0])
        console.log(response.data.data[0]);
      };
    
      useEffect(() => {
        fetchAPI()
      },[]);

    return (
        <div className="w-3/4 mx-auto bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-center mb-4">Sensor Data</h2>
            <div>{averageTemperature}</div>
        </div>
    );
}

export default Sensor;
