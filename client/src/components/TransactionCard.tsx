type TransactionCardProps = {
  title: string;
  amount: number;
  type: string;
  onDelete: () => void;
};

function TransactionCard({
  title,
  amount,
  type,
  onDelete,
}: TransactionCardProps) {
  const isIncome = type === "Income";

  return (
    <div className="transaction-card">

      <div className="transaction-icon">
        {isIncome ? "↑" : "↓"}
      </div>

      <div className="transaction-info">
        <strong>{title}</strong>

        <span>
          {isIncome ? "הכנסה" : "הוצאה"}
        </span>
      </div>

      <div
        className={
          isIncome
            ? "transaction-amount income"
            : "transaction-amount expense"
        }
      >
        {isIncome ? "+" : "-"}₪
        {amount.toLocaleString()}
      </div>

      <button
        className="delete-button"
        onClick={onDelete}
        title="מחיקת תנועה"
      >
        ×
      </button>

    </div>
  );
}

export default TransactionCard;