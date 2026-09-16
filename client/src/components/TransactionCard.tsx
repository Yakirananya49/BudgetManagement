type TransactionCardProps = {
  title: string;
  amount: number;
  type: string;
  category: string;
  onDelete: () => void;
};

function TransactionCard({
  title,
  amount,
  type,
  category,
  onDelete,
}: TransactionCardProps) {

  const isIncome = type === "income";

  return (
    <div className="transaction-card">

      <div className="transaction-info">

        <div className="transaction-icon">
          {isIncome ? "📈" : "📉"}
        </div>

        <div>
          <h3>{title}</h3>
          <p>{category}</p>
        </div>

      </div>

      <div className="transaction-right">

        <strong className={isIncome ? "income" : "expense"}>
          {isIncome ? "+" : "-"}₪{amount}
        </strong>

        <button
          className="delete-button"
          onClick={onDelete}
        >
          🗑️
        </button>

      </div>

    </div>
  );
}

export default TransactionCard;