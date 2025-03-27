import { useEffect, useState } from 'react'
import './styles.css'
import Sensor from './components/sensor'
import axios from 'axios'
function App() {
  const [count, setCount] = useState(0)

  const fetchAPI = async () => {
    const response = await axios.get("http://127.0.0.1:8080/users")
    console.log(response.data.users);
  };

  useEffect(() => {
    fetchAPI()
  },[]);

  return (
    <div className="bg-gray-600 min-h-screen flex items-center justify-start text-white">
      <Sensor></Sensor>
    </div>
  );
}

export default App
