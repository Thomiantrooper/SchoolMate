import React, { useEffect, useState, useContext } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { ThemeContext } from "../components/ThemeLayout"; 
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { darkMode } = useContext(ThemeContext);
  const [incomeData, setIncomeData] = useState(null);
  const [maintenanceData, setMaintenanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('March'); // State to store selected month

  // Fetch Income Data from the backend
  const fetchIncomeData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/income');
      const data = response.data.data;

      // Aggregate income per month
      const monthlyIncome = {
        January: 0, February: 0, March: 0, April: 0,
        May: 0, June: 0, July: 0, August: 0,
        September: 0, October: 0, November: 0, December: 0
      };

      data.forEach(item => {
        if (monthlyIncome[item.month] !== undefined) {
          monthlyIncome[item.month] += item.amount; // Summing income per month
        }
      });

      // Convert data into chart format
      setIncomeData({
        labels: Object.keys(monthlyIncome), // Months as labels
        datasets: [
          {
            label: "Total Income ($)",
            data: Object.values(monthlyIncome), // Monthly income values
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      });

    } catch (err) {
      setError("Error fetching income data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIncomeData();
  }, []);

  // Fetch Maintenance Data from the backend
  const fetchMaintenanceData = async (month) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/maintenance/maintenance-payments/${month}`);
      const payments = response.data.data;

      const paid = payments.filter(payment => payment.paidStatus === true).length;
      const pending = payments.filter(payment => payment.paidStatus === false).length;

      setMaintenanceData({
        labels: ['Paid', 'Pending'],
        datasets: [
          {
            data: [paid, pending],
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            hoverBackgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
          },
        ],
      });
    } catch (err) {
      setError('Error fetching maintenance data');
    }
  };

  useEffect(() => {
    fetchIncomeData(selectedMonth);
    fetchMaintenanceData(selectedMonth); // Fetch maintenance data for the selected month
    setLoading(false);
  }, [selectedMonth]); // Re-fetch data whenever the selected month changes

  // Handle month selection change
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className={`p-6 dark:bg-gray-800 dark:text-white ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          {/* Dropdown for month selection */}
          <div className="mb-6">
            <label htmlFor="month" className="text-lg font-semibold mr-2">Select Month:</label>
            <select
              id="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>

          {/* Grid to display charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Income Bar Chart */}
            <div className={`p-6 dark:bg-gray-800 dark:text-white ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          {/* Monthly Income Overview Bar Chart */}
          <div className={`p-4 border rounded-lg shadow-md  ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
            <h3 className="text-lg font-semibold mb-4">Monthly Income Overview</h3>
            {incomeData ? (
              <Bar 
                data={incomeData} 
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: "Total Income per Month",
                    },
                    legend: {
                      position: "top",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }} 
              />
            ) : (
              <p>No income data available</p>
            )}
          </div>
        </div>
      )}
    </div>


            {/* Maintenance Payments Pie Chart */}
            <div className={`p-4 border rounded-lg shadow-md ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
              <h3 className="text-lg font-semibold mb-4">Maintenance Payments Overview</h3>
              {maintenanceData ? (
                <Pie data={maintenanceData} options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: `Paid vs Pending Payments for ${selectedMonth}`,
                    },
                  },
                }} />
              ) : (
                <p>No data available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
