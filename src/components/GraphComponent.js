import React, { useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from "chart.js";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
);

const options = {
    plugins: { legend: { display: false } },
    layout: { padding: { bottom: 0 } },
    scales: {
      y: {
        ticks: {
          color: "white",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "#212226",
        },
      },
      x: {
        ticks: {
          color: "white",
          font: {
            size: 12,
          },
        },
      },
    },
    elements: {
      point: {
        backgroundColor: "#8884d8",
        borderColor: "#2e4355",
        borderWidth: 5,
        radius: 8,
      },
    },
};

const titleStyle = {
    color: 'white',
};
  
function GraphComponent() {
    const [userTestsData, setUserTestsData] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
      fetch(`http://localhost:8080/code/countUserTestsThreeMonths`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
        .then(response => response.json())
        .then(data => setUserTestsData(data))
        .catch(error => console.error('Error fetching data:', error));
    }, []); 

    const data = {
        labels: Object.keys(userTestsData || {}),
        datasets: [
          {
            label: 'тесты',
            data: Object.values(userTestsData || {}),
            fill: true,
            backgroundColor:"#4fe0b5",
            borderColor: "white", // Изменяем цвет линии на белый
            pointBorderColor: "white", // Изменяем цвет точек на белый
            pointBorderWidth:5,
            pointRadius:8,
            tension: 0.5
          },
        ],
      };
      
    return (
      <div className="GraphComponentContainer" style={{ height: '80%', width: '100%' }}>
      <h2 style={{ color: 'white' }}>Статистика тестов пользователя</h2>
      <div className="GraphComponent" style={{ height: '80%', width: '100%', margin: '0 auto' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  
    );
}
  
export default GraphComponent;
