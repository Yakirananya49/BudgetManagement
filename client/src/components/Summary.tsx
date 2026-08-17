type SummaryProps = {
  income: number;
  expense: number;
};

function Summary({ income, expense }: SummaryProps) {
  const balance = income - expense;

  return (
    <div className="summary">
      <div className="summary-card">
        <h4>Income</h4>
        <p className="income">₪{income}</p>
      </div>

      <div className="summary-card">
        <h4>Expense</h4>
        <p className="expense">₪{expense}</p>
      </div>

      <div className="summary-card">
        <h4>Balance</h4>
        <p className="balance">₪{balance}</p>
      </div>
    </div>
  );
}

export default Summary;