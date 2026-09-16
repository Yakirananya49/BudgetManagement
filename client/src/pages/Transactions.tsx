import TransactionCard from "../components/TransactionCard";

type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
};

type TransactionsProps = {
  transactions: Transaction[];
  onDelete: (id: number) => void;
};

function Transactions({
  transactions,
  onDelete,
}: TransactionsProps) {

  return (
    <div>

      <div className="page-title">
        <h1>התנועות שלי</h1>
        <p>כל ההכנסות וההוצאות שלך במקום אחד</p>
      </div>

      <div className="transactions-list">

        {transactions.map((transaction) => (

          <TransactionCard
            key={transaction.id}
            title={transaction.title}
            amount={transaction.amount}
            type={transaction.type}
            category={transaction.category}
            onDelete={() => onDelete(transaction.id)}
          />

        ))}

      </div>

      <div className="charts-section">

        <h2>📊 ניתוח התקציב</h2>

        <div className="charts-grid">

          <div className="chart-card">
            <h3>הכנסות מול הוצאות</h3>

            <div className="bar-chart">

              <div className="bar income-bar">
                <span>הכנסות</span>
              </div>

              <div className="bar expense-bar">
                <span>הוצאות</span>
              </div>

            </div>

          </div>

          <div className="chart-card">
            <h3>התפלגות הוצאות</h3>

            <div className="fake-pie-chart">
              📊
            </div>

            <p>כלכלה • דלק • פנאי</p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Transactions;