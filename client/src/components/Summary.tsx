type SummaryProps = {
  income: number;
  expense: number;
};

function Summary({ income, expense }: SummaryProps) {
  const balance = income - expense;

  return (
    <section className="summary">

      <div className="summary-card income-card">
        <div className="summary-top">
          <span>הכנסות</span>
          <div className="summary-icon income-icon">
            ↑
          </div>
        </div>

        <strong>
          ₪{income.toLocaleString()}
        </strong>

        <small>סה״כ הכנסות</small>
      </div>

      <div className="summary-card expense-card">
        <div className="summary-top">
          <span>הוצאות</span>
          <div className="summary-icon expense-icon">
            ↓
          </div>
        </div>

        <strong>
          ₪{expense.toLocaleString()}
        </strong>

        <small>סה״כ הוצאות</small>
      </div>

      <div className="summary-card balance-card">
        <div className="summary-top">
          <span>יתרה</span>
          <div className="summary-icon balance-icon">
            ₪
          </div>
        </div>

        <strong>
          ₪{balance.toLocaleString()}
        </strong>

        <small>
          {balance >= 0
            ? "מצב תקציבי חיובי"
            : "חריגה מהתקציב"}
        </small>
      </div>

    </section>
  );
}

export default Summary;