 import "./App.css";
 import Header from "./components/Header";
import TransactionCard from "./components/TransactionCard";
import Summary from "./components/Summary";
function App() {
  const transactions = [
  {
    id: 1,
    title: "Salary",
    amount: 7000,
    type: "Income",
  },
  {
    id: 2,
    title: "Supermarket",
    amount: 350,
    type: "Expense",
  },
  {
    id: 3,
    title: "Fuel",
    amount: 250,
    type: "Expense",
  },
];

  return (
   <div className="container">
      <Header />
      <Summary
  income={7000}
  expense={600}
/>
      <h1>Transactions</h1>
      

      {transactions.map((item) => (
        <TransactionCard
  key={item.id}
  title={item.title}
  amount={item.amount}
  type={item.type}
/>
      ))}

    </div>
  );
}

export default App;