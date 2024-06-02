import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('./eve.json').then((response) => {
      setData(response.data);
    });
  }, []);


  const formatChartData = () => {
    const LineData = {};
    data.forEach((item) => {
      const time = new Date(item.timestamp).toLocaleTimeString();
      LineData[time] = (LineData[time] || 0) + 1;
    });
    return { LineData };
  };

  const { LineData } = formatChartData();

  const lineData = {
    labels: Object.keys(LineData),
    datasets: [
      {
        label: "Number of Alerts Over TimeLine",
        data: Object.values(LineData),
        borderColor: '#4299e1',
        backgroundColor: 'rgba(66, 153, 225, 0.2)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 7,
        showLine: true,
        fill: true,
        cubicInterpolationMode: 'monotone'
      },
    ],
  };
  const uniqueSignatures = [...new Set(data.map(item => item.alert.signature))];
  const truncatedLabels = uniqueSignatures.map(label => {
    const maxLength = 14; 
    return label.length > maxLength? `${label.substring(0, maxLength)}...` : label;
  });
  
  const barData = {
    labels: truncatedLabels,
    datasets: [
      {
        label: 'Number of Alerts per Signature',
        data: uniqueSignatures.map(sig => data.filter(item => item.alert.signature === sig).length),
        backgroundColor: '#FF0150',
      },
    ],
  };
  
  const uniqueCategories = [...new Set(data.map(item => item.alert.category))];
  const pieData = {
    labels: uniqueCategories,
    datasets: [
      {
        label: 'Alert Categories',
        data: uniqueCategories.map(cat => data.filter(item => item.alert.category === cat).length),
        backgroundColor: ['#ed64a6', '#4caf50', '#f6c23e', '#42a5f5', '#9c27b0'],
      },
    ],
  };
  const uniqueRevs = [...new Set(data.map(item => item.alert.rev))];
  const revCounts = uniqueRevs.map(rev => data.filter(item => item.alert.rev === rev).length);
  
  const uniqueSeverities = [...new Set(data.map(item => item.alert.severity))];
  const severityCounts = uniqueSeverities.map(severity => data.filter(item => item.alert.severity === severity).length);
  
  const doughnutData = {
    labels: uniqueSeverities.map(severity => `Severity ${severity}`),
    datasets: [
      {
        label: 'Number of Alerts per Severity of the Alert',
        data: severityCounts,
        backgroundColor: [' #ed64a6', '#1e88e5', '#4caf50', '#f6c23e', '#42a5f5', '#9c27b0', '#1e88e5'],
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: (ctx) => ctx.chart.data.datasets[0].label,
        color: 'white',
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
      },
    },
  };

  const chartOptionsWithoutScales = {
    ...chartOptions,
    scales: {
     
    },
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="items-center mb-8">
        <img src="logo.png" alt="Logo" className="h-10 mr-5" /> 
        <h1 className="text-5xl py-4 text-gray-200 text-center "><strong>Dashboard</strong></h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg" style={{ height: '500px' }}>
          <Line data={lineData} options={chartOptions} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg" style={{ height: '500px' }}>
          <Bar data={barData} options={chartOptions} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg" style={{ height: '500px' }}>
          <Pie data={pieData} options={chartOptionsWithoutScales} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg" style={{ height: '500px' }}>
          <Doughnut data={doughnutData} options={chartOptionsWithoutScales} />
        </div>
      </div>
    </div>
  );
  
};

export default Dashboard;
