import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = () => {
  const [usersData, setUsersData] = useState(null);
  const [testsData, setTestsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const testsResponse = await fetch("http://localhost:8080/code/countThreeMonths");
        const testsData = await testsResponse.json();
        console.log(testsData);
        setTestsData(testsData);

        const usersResponse = await fetch("http://localhost:8080/person/countThreeMonths");
        const usersData = await usersResponse.json();
        setUsersData(usersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: usersData ? Object.keys(usersData) : [],
    datasets: [
      {
        label: "Тесты",
        data: testsData ? Object.values(testsData) : [],
        backgroundColor: "#4fe0b5"
      },
      {
        label: 'Новые пользователи',
        data: usersData ? Object.values(usersData) : [],
        backgroundColor: '#3f54d1',
      },
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      scales: {
        x: {
          type: "category",
          grid: {
            display: true
          }
        },
        y: {
          grid: {
            display: true
          },
          ticks: {
            beginAtZero: true
          }
        }
      }
    }
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export default ChartComponent;
