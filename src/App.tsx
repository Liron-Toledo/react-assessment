import React, { useEffect, useState } from 'react';

// Define the type for each transaction
interface Transaction {
  id: number;
  date: string;
  amount: number;
  merchant: string;
  category: string;
}

// Define the type for the API response
interface Response {
  next: {
    page: number;
    limit: number;
  };
  totalPages: number;
  currentPage: number;
  transactions: Transaction[];
}

// Enum for possible loading states
enum LoadingState {
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
  Empty = 'empty',
}

function App() {

  // State variables to track currently displayed transactions and loading state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);

  // Function to fetch transactions based on the page number
  const fetchTransactions = (page: number) => {
    setLoadingState(LoadingState.Loading);
    fetch(`https://tip-transactions.vercel.app/api/transactions?page=${page}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: Response) => {
        if (data.transactions.length === 0) {
          setLoadingState(LoadingState.Empty);
        } else {
          setTransactions(data.transactions);
          setLoadingState(LoadingState.Success);
        }
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
        setLoadingState(LoadingState.Error);
      });
  };

  // Fetch the first page of transactions when the component mounts
  useEffect(() => {
    fetchTransactions(1);
  }, []);

  // Function to format the date as "time - date"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = date.toLocaleDateString('en-GB');
    return `${time} - ${formattedDate}`;
  };

  // Function to render different possible states (e.g. loading, error, success, etc)
  const renderContent = () => {
    switch (loadingState) {
      case LoadingState.Loading:
        return (
          <div style={loadingStyle}>
            <p>Loading...</p>
          </div>
        );
      case LoadingState.Error:
        return <p>Error loading transactions. Please try again later.</p>;
      case LoadingState.Empty:
        return <p>No transactions found.</p>;
      case LoadingState.Success:
        return (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Merchant</th>
                <th style={thStyle}>Category</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td style={tdStyle}>{transaction.id}</td>
                  <td style={tdStyle}>{formatDate(transaction.date)}</td>
                  <td style={tdStyle}>£{transaction.amount.toFixed(2)}</td>
                  <td style={tdStyle}>{transaction.merchant}</td>
                  <td style={tdStyle}>{transaction.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{
        textAlign: 'center', fontFamily: 'Helvetica, Arial, sans-serif',
      }}>Expenses</h1>
      {renderContent()}
    </div>
  );
}

// Style for the loading container
const loadingStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80vh',
  fontSize: '1.5rem',
};

// Style for the table container
const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
  border: '1px solid #ddd',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

// Style for the table headers
const thStyle: React.CSSProperties = {
  borderBottom: '1px solid #ddd',
  borderRight: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
  backgroundColor: '#f2f2f2',
};

// Style for the table cells
const tdStyle: React.CSSProperties = {
  borderBottom: '1px solid #ddd',
  borderRight: '1px solid #ddd',
  padding: '8px',
};

export default App;