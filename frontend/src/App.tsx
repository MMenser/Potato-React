import { useEffect, useState } from 'react'
import './styles.css'
import Sensor from './components/sensor'
import axios from 'axios'
function App() {

  return (
    <div className="bg-gray-600 min-h-screen flex items-center justify-start text-white">
      <Sensor></Sensor>
    </div>
  );
}

export default App
