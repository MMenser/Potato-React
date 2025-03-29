import React, { useEffect, useState } from 'react';
import DataGraph from './datagraph';
import axios
 from 'axios';

function Sensor() {
    const [averageTemperature, setAverageTemperature] = useState(0.0);
    
    const fetchAPI = async () => {
        const response = await axios.get("http://127.0.0.1:8080/data")
        setAverageTemperature(response.data.data)
        console.log(response.data.data);
      };
    
      useEffect(() => {
        fetchAPI()
      },[]);

    return (
        <div className="w-3/4 mx-auto bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-center mb-4">{averageTemperature}</h2>
            <DataGraph></DataGraph>
        </div>
    );
}

export default Sensor;
