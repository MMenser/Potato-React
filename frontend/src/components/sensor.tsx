import React from 'react';
import DataGraph from './datagraph';

function Sensor() {
    return (
        <div className="w-3/4 mx-auto bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-center mb-4">Sensor Data</h2>
            <DataGraph></DataGraph>
        </div>
    );
}

export default Sensor;
