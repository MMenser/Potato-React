import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components for Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const data = [
    { time: 0, temp: 70 },
    { time: 1, temp: 71 },
    { time: 2, temp: 72 },
    { time: 3, temp: 71 },
    { time: 4, temp: 70 },
    { time: 5, temp: 69 },
];

// Prepare chart data
const chartData = {
    labels: data.map(d => d.time),
    datasets: [
        {
            label: 'Temperature (°F)',
            data: data.map(d => d.temp),
            borderColor: 'rgb(105, 12, 12)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            pointRadius: 5,
            fill: true,
            tension: 0.3, // Makes the line smooth
        },
    ],
};

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
function datagraph() {
    return (
      <div className="flex flex-col items-center">
        <Line data={chartData} options={options} />
        <div className="mt-4 flex justify-center space-x-4">
          <button className="px-4 py-2 bg-gray-700 text-white rounded-md">30 Minutes</button>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-md">12 Hour</button>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-md">24 Hour</button>
        </div>
      </div>
    );
  }
  

export default datagraph