type TransactionCardProps = {
  title: string;
  amount: number;
  type: string;
};

function TransactionCard({
  title,
  amount,
  type,
}: TransactionCardProps) {
 return (
  <div className="card">
    <div className="card-header">
      <h3>{title}</h3>
      <span className={type === "Income" ? "income" : "expense"}>
        ₪{amount}
      </span>
    </div>

    <p className={type === "Income" ? "income" : "expense"}>
      {type}
    </p>
  </div>
  );
}

export default TransactionCard;