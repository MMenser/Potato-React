import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { useState } from 'react';
import axios from 'axios';

// Register the required components for Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

interface GraphProps {
  id: number;
}

function datagraph({id}: GraphProps) {
  const [timeScale, setTimeScale] = useState(120); // Default time scale = limit of how many data points to show - 120 is 30 minutes of data where data is inserted every 15 seconds
  var data = []; // Initialize data as an empty array

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8080/getData/" + id + "/" + timeScale); // Get the most recent data point for this box
      console.log(response.data);
      for (let i = 0; i < response.data.length; i++) {
        var row = response.data[i]
        for (const dataPoint in row) {
          
        }
      }
    } catch (err) {
      console.error("Error fetching box data:", err);
    }
  };

  // Prepare chart data
  // const chartData = {
  //   labels: data.map(d => d.time),
  //   datasets: [
  //     {
  //       label: 'Temperature (°F)',
  //       data: data.map(d => d.temp),
  //       borderColor: 'rgb(105, 12, 12)',
  //       backgroundColor: 'rgba(0, 0, 0, 0.2)',
  //       pointRadius: 5,
  //       fill: true,
  //       tension: 0.3, // Makes the line smooth
  //     },
  //   ],
  // };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Temperature Over Time' },
    },
    scales: {
      x: { title: { display: true, text: 'Time (seconds)' } },
      y: { title: { display: true, text: 'Temperature (°F)' }, beginAtZero: false },
    },
  };

  fetchAPI(); // Fetch data when the component mounts

  return (
    <div className="flex flex-col items-center">
      {/* <Line data={chartData} options={options} /> */}
      <div className="mt-4 flex justify-center space-x-4">
        <button className="px-4 py-2 bg-gray-700 text-white rounded-md">30 Minutes</button>
        <button className="px-4 py-2 bg-gray-700 text-white rounded-md">12 Hour</button>
        <button className="px-4 py-2 bg-gray-700 text-white rounded-md">24 Hour</button>
      </div>
    </div>
  );
}


export default datagraph