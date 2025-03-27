import { useState } from 'react'
import './styles.css'
import Sensor from './components/sensor'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-gray-600 min-h-screen flex items-center justify-start text-white">
      <Sensor></Sensor>
      <Sensor></Sensor>
    </div>
  );
}

export default App
