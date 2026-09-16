type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
};

type ReportsProps = {
  transactions: Transaction[];
};

const categories = [
  { name: "כלכלה", icon: "🍔" },
  { name: "פנאי", icon: "🎮" },
  { name: "דלק", icon: "🚗" },
  { name: "משכורת", icon: "💼" },
  { name: "אחר", icon: "📦" },
];

const chartColors = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#64748b",
];

function Reports({ transactions }: ReportsProps) {

  // =========================
  // TOTALS
  // =========================

  const income = transactions
    .filter(
      (transaction) =>
        transaction.type === "income"
    )
    .reduce(
      (sum, transaction) =>
        sum + transaction.amount,
      0
    );

  const expenses = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .reduce(
      (sum, transaction) =>
        sum + transaction.amount,
      0
    );

  const balance = income - expenses;

  // =========================
  // EXPENSES
  // =========================

  const expenseTransactions =
    transactions.filter(
      (transaction) =>
        transaction.type === "expense"
    );

  const averageExpense =
    expenseTransactions.length > 0
      ? expenses / expenseTransactions.length
      : 0;

  const largestExpense =
    expenseTransactions.length > 0
      ? [...expenseTransactions].sort(
          (a, b) =>
            b.amount - a.amount
        )[0]
      : null;

  // =========================
  // MONEY FORMAT
  // =========================

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat(
      "he-IL",
      {
        style: "currency",
        currency: "ILS",
        maximumFractionDigits: 0,
      }
    ).format(value);
  };

  // =========================
  // CATEGORY TOTALS
  // =========================

  const categoryTotals =
    categories.map((category) => {

      const total =
        expenseTransactions
          .filter(
            (transaction) =>
              transaction.category ===
              category.name
          )
          .reduce(
            (sum, transaction) =>
              sum + transaction.amount,
            0
          );

      return {
        ...category,
        total,
      };
    });

  // =========================
  // PIE CHART
  // =========================

  let currentPercentage = 0;

  const pieSegments =
    categoryTotals
      .filter(
        (category) =>
          category.total > 0
      )
      .map(
        (category, index) => {

          const percentage =
            expenses > 0
              ? (category.total /
                  expenses) *
                100
              : 0;

          const start =
            currentPercentage;

          currentPercentage +=
            percentage;

          return {
            ...category,
            percentage,
            start,
            end: currentPercentage,
            color:
              chartColors[
                index %
                  chartColors.length
              ],
          };
        }
      );

  const pieBackground =
    pieSegments.length > 0
      ? `conic-gradient(${pieSegments
          .map(
            (segment) =>
              `${segment.color} ${segment.start}% ${segment.end}%`
          )
          .join(", ")})`
      : "transparent";

  // =========================
  // BAR CHART
  // =========================

  const maxAmount =
    Math.max(income, expenses, 1);

  const incomeHeight =
    (income / maxAmount) * 100;

  const expenseHeight =
    (expenses / maxAmount) * 100;

  // =========================
  // RETURN
  // =========================

  return (
    <div className="reports-page">

      {/* TITLE */}

      <div className="reports-title">

        <span>
          ניתוח פיננסי
        </span>

        <h1>
          דוחות וניתוחים 📊
        </h1>

        <p>
          תמונת מצב מלאה של הפעילות
          הפיננסית שלך.
        </p>

      </div>


      {/* SUMMARY */}

      <div className="report-summary">

        <div className="report-card report-income">

          <div className="report-card-icon">
            ↗
          </div>

          <span>
            הכנסות
          </span>

          <strong>
            {formatMoney(income)}
          </strong>

          <small>
            סך כל ההכנסות
          </small>

        </div>


        <div className="report-card report-expense">

          <div className="report-card-icon">
            ↘
          </div>

          <span>
            הוצאות
          </span>

          <strong>
            {formatMoney(expenses)}
          </strong>

          <small>
            סך כל ההוצאות
          </small>

        </div>


        <div className="report-card report-balance">

          <div className="report-card-icon">
            ₪
          </div>

          <span>
            יתרה
          </span>

          <strong>
            {formatMoney(balance)}
          </strong>

          <small>
            הכנסות פחות הוצאות
          </small>

        </div>

      </div>


      {/* =========================
          CHARTS
      ========================= */}

      <div className="reports-charts">

        {/* PIE */}

        <section className="report-panel chart-panel">

          <div className="report-panel-header">

            <div>

              <span>
                פילוח הוצאות
              </span>

              <h2>
                הוצאות לפי קטגוריה
              </h2>

            </div>

            <div className="report-panel-icon">
              🥧
            </div>

          </div>


          {pieSegments.length > 0 ? (

            <div className="pie-chart-area">

              <div
                className="pie-chart"
                style={{
                  background:
                    pieBackground,
                }}
              >
                <div className="pie-center">

                  <strong>
                    {formatMoney(
                      expenses
                    )}
                  </strong>

                  <span>
                    סך הוצאות
                  </span>

                </div>
              </div>


              <div className="pie-legend">

                {pieSegments.map(
                  (segment) => (

                    <div
                      className="pie-legend-item"
                      key={segment.name}
                    >

                      <div className="legend-right">

                        <span
                          className="legend-dot"
                          style={{
                            backgroundColor:
                              segment.color,
                          }}
                        />

                        <span>
                          {segment.icon}{" "}
                          {segment.name}
                        </span>

                      </div>

                      <strong>
                        {segment.percentage.toFixed(
                          0
                        )}
                        %
                      </strong>

                    </div>

                  )
                )}

              </div>

            </div>

          ) : (

            <div className="chart-empty">

              <div>
                📊
              </div>

              <p>
                אין עדיין הוצאות להצגה
              </p>

            </div>

          )}

        </section>


        {/* BAR */}

        <section className="report-panel chart-panel">

          <div className="report-panel-header">

            <div>

              <span>
                השוואה
              </span>

              <h2>
                הכנסות מול הוצאות
              </h2>

            </div>

            <div className="report-panel-icon">
              📈
            </div>

          </div>


          <div className="bar-chart">

            <div className="bar-area">

              <div className="bar-column">

                <span className="bar-value">
                  {formatMoney(income)}
                </span>

                <div
                  className="bar income-bar"
                  style={{
                    height:
                      `${Math.max(
                        incomeHeight,
                        income > 0
                          ? 5
                          : 0
                      )}%`,
                  }}
                />

                <span className="bar-label">
                  הכנסות
                </span>

              </div>


              <div className="bar-column">

                <span className="bar-value">
                  {formatMoney(expenses)}
                </span>

                <div
                  className="bar expense-bar"
                  style={{
                    height:
                      `${Math.max(
                        expenseHeight,
                        expenses > 0
                          ? 5
                          : 0
                      )}%`,
                  }}
                />

                <span className="bar-label">
                  הוצאות
                </span>

              </div>

            </div>

          </div>

        </section>

      </div>


      {/* =========================
          DETAILS
      ========================= */}

      <div className="reports-grid">

        {/* CATEGORIES */}

        <section className="report-panel">

          <div className="report-panel-header">

            <div>

              <span>
                פירוט
              </span>

              <h2>
                הוצאות לפי קטגוריה
              </h2>

            </div>

            <div className="report-panel-icon">
              📊
            </div>

          </div>


          <div className="report-categories">

            {categories.map(
              (category) => {

                const total =
                  categoryTotals.find(
                    (item) =>
                      item.name ===
                      category.name
                  )?.total || 0;

                const percentage =
                  expenses > 0
                    ? (total / expenses) *
                      100
                    : 0;

                return (

                  <div
                    className="report-category"
                    key={category.name}
                  >

                    <div className="report-category-top">

                      <div>

                        <span>
                          {category.icon}
                        </span>

                        <strong>
                          {category.name}
                        </strong>

                      </div>

                      <strong>
                        {formatMoney(total)}
                      </strong>

                    </div>


                    <div className="report-track">

                      <div
                        className="report-fill"
                        style={{
                          width:
                            `${percentage}%`,
                        }}
                      />

                    </div>


                    <small>
                      {percentage.toFixed(0)}%
                      מההוצאות
                    </small>

                  </div>

                );
              }
            )}

          </div>

        </section>


        {/* INSIGHTS */}

        <section className="report-panel">

          <div className="report-panel-header">

            <div>

              <span>
                נתונים מרכזיים
              </span>

              <h2>
                סיכום פיננסי
              </h2>

            </div>

            <div className="report-panel-icon">
              💡
            </div>

          </div>


          <div className="insights-list">

            <div className="report-insight">

              <div>
                📊
              </div>

              <div>

                <span>
                  מספר התנועות
                </span>

                <strong>
                  {transactions.length}
                </strong>

              </div>

            </div>


            <div className="report-insight">

              <div>
                💰
              </div>

              <div>

                <span>
                  ממוצע הוצאה
                </span>

                <strong>
                  {formatMoney(
                    averageExpense
                  )}
                </strong>

              </div>

            </div>


            <div className="report-insight">

              <div>
                🔝
              </div>

              <div>

                <span>
                  ההוצאה הגדולה ביותר
                </span>

                <strong>
                  {largestExpense
                    ? largestExpense.title
                    : "אין נתונים"}
                </strong>

                {largestExpense && (

                  <small>
                    {formatMoney(
                      largestExpense.amount
                    )}
                  </small>

                )}

              </div>

            </div>


            <div className="report-insight">

              <div>
                ⚖️
              </div>

              <div>
  <span>
    מצב החודש
  </span>

  <strong>
    ₪{(income - expenses).toLocaleString()}
  </strong>

  <small>
    נשאר לאחר הוצאות
  </small>
</div>

            </div>

          </div>

        </section>

      </div>


      {/* EMPTY */}

      {transactions.length === 0 && (

        <div className="reports-empty">

          <div>
            📊
          </div>

          <h2>
            עדיין אין מספיק נתונים
          </h2>

          <p>
            הוסף תנועות כדי לראות כאן
            ניתוחים ודוחות.
          </p>

        </div>

      )}

    </div>
  );
}

export default Reports;