import { useState } from "react";

export default function FinanceDashboard() {
  const [transactions, setTransactions] = useState([
    { id: 1, name: "Salary", amount: 5000, type: "income", date: "2025-02-28" },
    { id: 2, name: "Rent", amount: 1200, type: "expense", date: "2025-02-27" },
    { id: 3, name: "Groceries", amount: 300, type: "expense", date: "2025-02-26" },
    { id: 4, name: "Freelance Work", amount: 800, type: "income", date: "2025-02-25" },
  ]);

  const totalRevenue = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  const balance = totalRevenue - totalExpenses;

  // Inline styles for the page layout
  const cardStyle = {
    padding: '1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '1rem',
  };
  
  const cardContentStyle = {
    padding: '1rem',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  };

  const tableHeaderStyle = {
    backgroundColor: '#f3f4f6',
    textAlign: 'left',
    padding: '0.5rem',
  };

  const tableCellStyle = {
    borderBottom: '1px solid #ddd',
    padding: '0.5rem',
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {/* Total Revenue Card */}
        <div style={{ ...cardStyle, backgroundColor: '#D1F8D1' }}>
          <div style={cardContentStyle}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#4CAF50' }}>Total Revenue</h3>
            <p style={{ fontSize: '2rem', fontWeight: '700' }}>${totalRevenue}</p>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div style={{ ...cardStyle, backgroundColor: '#F8D1D1' }}>
          <div style={cardContentStyle}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#F44336' }}>Total Expenses</h3>
            <p style={{ fontSize: '2rem', fontWeight: '700' }}>${totalExpenses}</p>
          </div>
        </div>

        {/* Balance Card */}
        <div style={{ ...cardStyle, backgroundColor: '#D1E8F8' }}>
          <div style={cardContentStyle}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2196F3' }}>Balance</h3>
            <p style={{ fontSize: '2rem', fontWeight: '700' }}>${balance}</p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', padding: '1rem', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Recent Transactions</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Amount</th>
              <th style={tableHeaderStyle}>Date</th>
              <th style={tableHeaderStyle}>Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td style={tableCellStyle}>{t.name}</td>
                <td style={tableCellStyle}>${t.amount}</td>
                <td style={tableCellStyle}>{t.date}</td>
                <td style={{ ...tableCellStyle, color: t.type === "income" ? '#4CAF50' : '#F44336' }}>
                  {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
