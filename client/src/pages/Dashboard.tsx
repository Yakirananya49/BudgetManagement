import "./Dashboard.css";

type TransactionType = "income" | "expense";

type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
};

type DashboardProps = {
  transactions: Transaction[];
  budget: number;
  onAddTransaction: () => void;
};

function Dashboard({
  transactions,
  budget,
  onAddTransaction,
}: DashboardProps) {

  // =========================
  // CALCULATIONS
  // =========================

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  const balance = income - expenses;

  const budgetUsed =
    budget > 0
      ? Math.min((expenses / budget) * 100, 100)
      : 0;

  // =========================
  // CATEGORIES
  // =========================

  const categoryData = [
    {
      name: "🍔 כלכלה",
      value: transactions
        .filter(
          (transaction) =>
            transaction.type === "expense" &&
            transaction.category === "מזון"
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0
        ),
    },
    {
      name: "🚗 דלק",
      value: transactions
        .filter(
          (transaction) =>
            transaction.type === "expense" &&
            transaction.category === "דלק"
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0
        ),
    },
    {
      name: "🎮 פנאי",
      value: transactions
        .filter(
          (transaction) =>
            transaction.type === "expense" &&
            transaction.category === "פנאי"
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0
        ),
    },
    {
      name: "📚 לימודים",
      value: transactions
        .filter(
          (transaction) =>
            transaction.type === "expense" &&
            transaction.category === "לימודים"
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0
        ),
    },
  ];

  const recentTransactions =
    transactions.slice(0, 4);

  // =========================
  // FORMAT MONEY
  // =========================

  const formatMoney = (value: number) => {
    return `₪${value.toLocaleString("he-IL")}`;
  };

  // =========================
  // CATEGORY MAX
  // =========================

  const maxCategoryValue = Math.max(
    ...categoryData.map(
      (category) => category.value
    ),
    1
  );

  // =========================
  // RETURN
  // =========================

  return (
    <div className="dashboard-page">

      {/* =========================
          HERO
      ========================= */}

      <section className="dashboard-hero">

        <div className="hero-content">

          <span className="hero-label">
            סקירה כללית
          </span>

          <h1>
            שלום 👋
          </h1>

          <p>
            הנה תמונת המצב של התקציב שלך
          </p>

        </div>

        <button
          className="hero-add-button"
          onClick={onAddTransaction}
        >
          <span>＋</span>
          הוספת תנועה
        </button>

      </section>

      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <section className="dashboard-summary">

        <div className="dashboard-card balance-card">

          <div className="card-top">
            <div className="card-icon balance-icon">
              💰
            </div>

            <span className="card-label">
              יתרה
            </span>
          </div>

          <strong>
            {formatMoney(balance)}
          </strong>

          <p>
            היתרה הנוכחית שלך
          </p>

        </div>

        <div className="dashboard-card income-card">

          <div className="card-top">
            <div className="card-icon income-icon">
              📈
            </div>

            <span className="card-label">
              הכנסות
            </span>
          </div>

          <strong>
            {formatMoney(income)}
          </strong>

          <p>
            סך כל ההכנסות
          </p>

        </div>

        <div className="dashboard-card expense-card">

          <div className="card-top">
            <div className="card-icon expense-icon">
              📉
            </div>

            <span className="card-label">
              הוצאות
            </span>
          </div>

          <strong>
            {formatMoney(expenses)}
          </strong>

          <p>
            סך כל ההוצאות
          </p>

        </div>

      </section>

      {/* =========================
          MIDDLE SECTION
      ========================= */}

      <section className="dashboard-middle">

        {/* BUDGET */}

        <div className="dashboard-panel budget-panel">

          <div className="panel-header">

            <div>
              <span className="panel-label">
                התקציב שלי
              </span>

              <h2>
                תקציב חודשי
              </h2>
            </div>

            <div className="panel-icon">
              🎯
            </div>

          </div>

          <div className="budget-numbers">

            <div>
              <span>
                נוצל
              </span>

              <strong>
                {formatMoney(expenses)}
              </strong>
            </div>

            <div>
              <span>
                תקציב
              </span>

              <strong>
                {formatMoney(budget)}
              </strong>
            </div>

          </div>

          <div className="progress-background">

            <div
              className="progress-fill"
              style={{
                width: `${budgetUsed}%`,
              }}
            />

          </div>

          <div className="budget-footer">

            <span>
              {Math.round(budgetUsed)}% מהתקציב נוצל
            </span>

            <span>
              נשארו{" "}
              {formatMoney(
                Math.max(budget - expenses, 0)
              )}
            </span>

          </div>

        </div>

        {/* CATEGORIES */}

        <div className="dashboard-panel categories-panel">

          <div className="panel-header">

            <div>
              <span className="panel-label">
                ניתוח
              </span>

              <h2>
                הוצאות לפי קטגוריה
              </h2>
            </div>

            <div className="panel-icon">
              📊
            </div>

          </div>

          <div className="categories-list">

            {categoryData.map(
              (category) => (

                <div
                  className="category-row"
                  key={category.name}
                >

                  <div className="category-info">

                    <span>
                      {category.name}
                    </span>

                    <strong>
                      {formatMoney(
                        category.value
                      )}
                    </strong>

                  </div>

                  <div className="category-bar-background">

                    <div
                      className="category-bar"
                      style={{
                        width: `${
                          (category.value /
                            maxCategoryValue) *
                          100
                        }%`,
                      }}
                    />

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </section>

      {/* =========================
          RECENT TRANSACTIONS
      ========================= */}

      <section className="dashboard-panel recent-panel">

        <div className="recent-header">

          <div>
            <span className="panel-label">
              פעילות
            </span>

            <h2>
              תנועות אחרונות
            </h2>
          </div>

          <button
            className="small-add-button"
            onClick={onAddTransaction}
          >
            ＋ הוספת תנועה
          </button>

        </div>

        <div className="recent-list">

          {recentTransactions.length === 0 ? (

            <div className="empty-transactions">
              עדיין אין תנועות
            </div>

          ) : (

            recentTransactions.map(
              (transaction) => (

                <div
                  className="recent-transaction"
                  key={transaction.id}
                >

                  <div className="recent-left">

                    <div className="recent-icon">
                      {transaction.type ===
                      "income"
                        ? "💰"
                        : transaction.category ===
                          "כלכלה"
                        ? "🍔"
                        : transaction.category ===
                          "דלק"
                        ? "🚗"
                        : transaction.category ===
                          "פנאי"
                        ? "🎮"
                        : "📦"}
                    </div>

                    <div>

                      <h3>
                        {transaction.title}
                      </h3>

                      <p>
                        {transaction.category}
                      </p>

                    </div>

                  </div>

                  <strong
                    className={
                      transaction.type ===
                      "income"
                        ? "transaction-income"
                        : "transaction-expense"
                    }
                  >
                    {transaction.type ===
                    "income"
                      ? "+"
                      : "-"}
                    {formatMoney(
                      transaction.amount
                    )}
                  </strong>

                </div>

              )
            )

          )}

        </div>

      </section>

    </div>
  );
}

export default Dashboard;