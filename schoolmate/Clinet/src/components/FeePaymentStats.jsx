import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "./ThemeLayout";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PaymentStats = () => {
  const { darkMode } = useContext(ThemeContext); // Get dark mode state
  const [payments, setPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [statusData, setStatusData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [bankData, setBankData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/payments")
      .then(response => {
        setPayments(response.data);
        processStats(response.data);
      })
      .catch(error => console.error("Error fetching payments:", error));
  }, []);

  const processStats = (data) => {
    const total = data.reduce((sum, payment) => sum + payment.amount, 0);
    setTotalAmount(total);

    const statusCounts = data.reduce((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {});
    setStatusData(Object.keys(statusCounts).map(status => ({ name: status, value: statusCounts[status] })));

    const monthlyCounts = data.reduce((acc, payment) => {
      acc[payment.month] = (acc[payment.month] || 0) + payment.amount;
      return acc;
    }, {});
    setMonthlyData(Object.keys(monthlyCounts).map(month => ({ month, amount: monthlyCounts[month] })));

    const bankCounts = data.reduce((acc, payment) => {
      acc[payment.bank] = (acc[payment.bank] || 0) + payment.amount;
      return acc;
    }, {});
    setBankData(Object.keys(bankCounts).map(bank => ({ bank, amount: bankCounts[bank] })));
  };

  return (
    <div className={`p-6 min-h-screen transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    }`}>
      <h2 className="text-2xl font-bold mb-4">Student Fee Payment Statistics</h2>
      
      <div className={`mb-4 p-4 shadow rounded-lg transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <h3 className="text-lg font-semibold">Total Payments: ${totalAmount.toFixed(2)}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart - Payment Status */}
        <div className={`p-4 shadow rounded-lg transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}>
          <h3 className="text-lg font-semibold mb-2">Payment Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Payments by Month */}
        <div className={`p-4 shadow rounded-lg transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}>
          <h3 className="text-lg font-semibold mb-2">Payments by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" stroke={darkMode ? "#ffffff" : "#000000"} />
              <YAxis stroke={darkMode ? "#ffffff" : "#000000"} />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table - Payments by Bank */}
      <div className={`mt-6 p-4 shadow rounded-lg transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <h3 className="text-lg font-semibold mb-2">Payments by Bank</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className={`transition-all duration-300 ${
              darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"
            }`}>
              <th className="border p-2">Bank</th>
              <th className="border p-2">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {bankData.map((bank, index) => (
              <tr key={index} className="border">
                <td className="border p-2">{bank.bank}</td>
                <td className="border p-2">${bank.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentStats;
