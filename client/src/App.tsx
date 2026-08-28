import { useEffect, useMemo, useState } from "react";
import "./App.css";

import pic1 from "./assets/pic1.png";
import pic2 from "./assets/pic2.png";

type TransactionType = "Income" | "Expense";

type Transaction = {
  _id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
};

const API_URL = "http://localhost:5000/api/transactions";

const categories = [
  { name: "Food", label: "מזון", icon: "🍔" },
  { name: "Entertainment", label: "בילויים", icon: "🎮" },
  { name: "Fuel", label: "תחבורה", icon: "🚗" },
  { name: "Education", label: "לימודים", icon: "📚" },
  { name: "Other", label: "אחר", icon: "📦" },
];

function App() {
  /* =========================
     STATE
  ========================= */

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("Expense");
  const [category, setCategory] = useState("Food");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<"home" | "reports">("home");
  const [saving, setSaving] = useState(false);

  const [budget, setBudget] = useState(10000);

  /* =========================
     LOAD TRANSACTIONS
  ========================= */

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Server error");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setTransactions(data);
        }
      } catch (error) {
        console.warn("לא ניתן להתחבר לשרת כרגע:", error);
      }
    };

    loadTransactions();
  }, []);

  /* =========================
     CALCULATIONS
  ========================= */

  const income = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "Income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [transactions]);

  const expense = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "Expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [transactions]);

  const balance = income - expense;

  const remainingBudget = Math.max(budget - expense, 0);

  const budgetPercentage =
    budget > 0
      ? Math.min((expense / budget) * 100, 100)
      : 0;

  /* =========================
     CATEGORY CALCULATIONS
  ========================= */

  const categoryTotals = useMemo(() => {
    return categories.map((categoryItem) => {
      const total = transactions
        .filter(
          (transaction) =>
            transaction.type === "Expense" &&
            transaction.category === categoryItem.name
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        ...categoryItem,
        total,
      };
    });
  }, [transactions]);

  const maxCategoryAmount = Math.max(
    ...categoryTotals.map((categoryItem) => categoryItem.total),
    1
  );

  /* =========================
     ADD TRANSACTION
  ========================= */

  const addTransaction = async () => {
    if (!title.trim()) {
      alert("נא להזין תיאור לתנועה");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("נא להזין סכום גדול מ־0");
      return;
    }

    const localTransaction: Transaction = {
      _id: Date.now().toString(),
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      date: new Date().toISOString(),
    };

    try {
      setSaving(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: localTransaction.title,
          amount: localTransaction.amount,
          type: localTransaction.type,
          category: localTransaction.category,
        }),
      });

      if (response.ok) {
        const savedTransaction = await response.json();

        setTransactions((previous) => [
          savedTransaction,
          ...previous,
        ]);
      } else {
        setTransactions((previous) => [
          localTransaction,
          ...previous,
        ]);
      }
    } catch (error) {
      console.warn(
        "השרת לא זמין. התנועה נוספה באופן מקומי.",
        error
      );

      setTransactions((previous) => [
        localTransaction,
        ...previous,
      ]);
    } finally {
      setSaving(false);

      setTitle("");
      setAmount("");
      setType("Expense");
      setCategory("Food");

      setIsModalOpen(false);
    }
  };

  /* =========================
     DELETE TRANSACTION
  ========================= */

  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.warn(
        "לא ניתן למחוק מהשרת כרגע, מוחק מהתצוגה.",
        error
      );
    }

    setTransactions((previous) =>
      previous.filter(
        (transaction) => transaction._id !== id
      )
    );
  };

  /* =========================
     FORMAT MONEY
  ========================= */

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 0,
    }).format(value);
  };

  /* =========================
     FORMAT DATE
  ========================= */

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  /* =========================
     STATUS
  ========================= */

  const statusText =
    balance >= 0
      ? "אתה במצב מצוין"
      : "כדאי לשים לב להוצאות";

  /* =========================
     HOME PAGE
  ========================= */

  const renderHome = () => {
    return (
      <>
        {/* HERO */}

        <section className="hero-card">
          <div className="hero-content">
            <div className="hero-label">
              מצב פיננסי
            </div>

            <h2>{statusText}</h2>

            <p>
              המשך לעקוב אחרי ההכנסות וההוצאות שלך
              ולשמור על שליטה בתקציב החודשי.
            </p>

            <span
              className={
                balance >= 0
                  ? "status-badge positive"
                  : "status-badge negative"
              }
            >
              {balance >= 0 ? "✓ הכל תחת שליטה" : "⚠ נדרשת תשומת לב"}
            </span>
          </div>

          <div className="hero-images">
            <img
              src={pic1}
              alt="ניהול תקציב"
              className="hero-image image-one"
            />

            <img
              src={pic2}
              alt="מעקב פיננסי"
              className="hero-image image-two"
            />
          </div>
        </section>

        {/* SUMMARY */}

        <section className="summary-grid">
          <div className="summary-card income-card">
            <span>סה״כ הכנסות</span>
            <strong>{formatMoney(income)}</strong>
            <small>הכנסות החודש</small>
          </div>

          <div className="summary-card expense-card">
            <span>סה״כ הוצאות</span>
            <strong>{formatMoney(expense)}</strong>
            <small>הוצאות החודש</small>
          </div>

          <div className="summary-card balance-card">
            <span>יתרה</span>
            <strong>{formatMoney(balance)}</strong>
            <small>מצב התקציב הנוכחי</small>
          </div>
        </section>

        {/* BUDGET */}

        <section className="budget-card">
          <div className="section-title-row">
            <div>
              <span>תקציב חודשי</span>

              <h3>
                {formatMoney(expense)}
              </h3>
            </div>

            <div className="budget-number">
              מתוך {formatMoney(budget)}
            </div>
          </div>

          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: `${budgetPercentage}%`,
              }}
            />
          </div>

          <div className="budget-footer">
            <span>
              נוצלו {budgetPercentage.toFixed(0)}%
            </span>

            <span>
              נותרו {formatMoney(remainingBudget)}
            </span>
          </div>
        </section>

        {/* CATEGORIES */}

        <section className="content-card">
          <div className="section-heading">
            <div>
              <span>מעקב לפי קטגוריות</span>
              <h2>קטגוריות הוצאות</h2>
            </div>
          </div>

          <div className="categories-list">
            {categoryTotals.map((categoryItem) => {
              const percentage =
                (categoryItem.total / maxCategoryAmount) * 100;

              return (
                <div
                  className="category-row"
                  key={categoryItem.name}
                >
                  <div className="category-info">
                    <div className="category-icon">
                      {categoryItem.icon}
                    </div>

                    <div>
                      <strong>
                        {categoryItem.label}
                      </strong>

                      <span>
                        {formatMoney(categoryItem.total)}
                      </span>
                    </div>
                  </div>

                  <div className="category-progress">
                    <div className="category-progress-track">
                      <div
                        className="category-progress-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <span>
                      {categoryItem.total > 0
                        ? `${Math.round(
                            (categoryItem.total / expense) * 100
                          ) || 0}%`
                        : "0%"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RECENT TRANSACTIONS */}

        <section className="content-card">
          <div className="section-heading">
            <div>
              <span>פעילות אחרונה</span>
              <h2>תנועות אחרונות</h2>
            </div>

            <span>
              {transactions.length} תנועות
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                📊
              </div>

              <h3>אין עדיין תנועות</h3>

              <p>
                לחץ על כפתור ה־+ כדי להוסיף את
                התנועה הראשונה שלך.
              </p>
            </div>
          ) : (
            <div className="transactions-list">
              {transactions
                .slice(0, 8)
                .map((transaction) => {
                  const categoryInfo =
                    categories.find(
                      (item) =>
                        item.name === transaction.category
                    );

                  return (
                    <div
                      className="transaction-row"
                      key={transaction._id}
                    >
                      <div className="transaction-icon">
                        {categoryInfo?.icon || "💳"}
                      </div>

                      <div className="transaction-main">
                        <strong>
                          {transaction.title}
                        </strong>

                        <span>
                          {categoryInfo?.label ||
                            transaction.category}{" "}
                          •{" "}
                          {formatDate(transaction.date)}
                        </span>
                      </div>

                      <div
                        className={`transaction-amount ${
                          transaction.type === "Income"
                            ? "income-text"
                            : "expense-text"
                        }`}
                      >
                        {transaction.type === "Income"
                          ? "+"
                          : "-"}{" "}
                        {formatMoney(transaction.amount)}
                      </div>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteTransaction(
                            transaction._id
                          )
                        }
                      >
                        מחק
                      </button>
                    </div>
                  );
                })}
            </div>
          )}
        </section>

        {/* FLOATING BUTTON */}

        <button
          className="floating-button"
          onClick={() => setIsModalOpen(true)}
          aria-label="הוספת תנועה"
        >
          +
        </button>
      </>
    );
  };

  /* =========================
     REPORTS PAGE
  ========================= */

  const renderReports = () => {
    const averageExpense =
      transactions.filter(
        (transaction) =>
          transaction.type === "Expense"
      ).length > 0
        ? Math.round(
            expense /
              transactions.filter(
                (transaction) =>
                  transaction.type === "Expense"
              ).length
          )
        : 0;

    const largestExpense =
      transactions
        .filter(
          (transaction) =>
            transaction.type === "Expense"
        )
        .sort(
          (a, b) => b.amount - a.amount
        )[0];

    return (
      <>
        <section className="page-title">
          <span>ניתוח פיננסי</span>

          <h2>דוחות וניתוחים</h2>

          <p>
            תמונת מצב מלאה של הפעילות הפיננסית שלך.
          </p>
        </section>

        <section className="report-summary">
          <div className="report-box income-card">
            <span>הכנסות</span>
            <strong>{formatMoney(income)}</strong>
          </div>

          <div className="report-box expense-card">
            <span>הוצאות</span>
            <strong>{formatMoney(expense)}</strong>
          </div>

          <div className="report-box balance-card">
            <span>יתרה</span>
            <strong>{formatMoney(balance)}</strong>
          </div>
        </section>

        <section className="report-grid">
          <div className="content-card">
            <div className="section-heading">
              <div>
                <span>פילוח הוצאות</span>
                <h2>הוצאות לפי קטגוריה</h2>
              </div>
            </div>

            <div className="report-categories">
              {categoryTotals.map((categoryItem) => {
                const percentage =
                  expense > 0
                    ? (categoryItem.total / expense) * 100
                    : 0;

                return (
                  <div key={categoryItem.name}>
                    <div className="report-category-header">
                      <span>
                        {categoryItem.icon}{" "}
                        {categoryItem.label}
                      </span>

                      <strong>
                        {formatMoney(
                          categoryItem.total
                        )}
                      </strong>
                    </div>

                    <div className="report-track">
                      <div
                        className="report-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="content-card">
            <div className="section-heading">
              <div>
                <span>נתונים מרכזיים</span>
                <h2>סיכום</h2>
              </div>
            </div>

            <div className="insight">
              <div>📊</div>

              <p>
                מספר התנועות במערכת:{" "}
                <strong>
                  {transactions.length}
                </strong>
              </p>
            </div>

            <div className="insight">
              <div>💰</div>

              <p>
                ממוצע הוצאה לתנועה:{" "}
                <strong>
                  {formatMoney(averageExpense)}
                </strong>
              </p>
            </div>

            <div className="insight">
              <div>🔝</div>

              <p>
                ההוצאה הגדולה ביותר:{" "}
                <strong>
                  {largestExpense
                    ? `${largestExpense.title} — ${formatMoney(
                        largestExpense.amount
                      )}`
                    : "אין נתונים"}
                </strong>
              </p>
            </div>

            <div className="insight">
              <div>🎯</div>

              <p>
                ניצול התקציב החודשי:{" "}
                <strong>
                  {budgetPercentage.toFixed(0)}%
                </strong>
              </p>
            </div>
          </div>
        </section>
      </>
    );
  };

  /* =========================
     MAIN RETURN
  ========================= */

  return (
    <div
      className="app"
      dir="rtl"
    >
      {/* HEADER */}

      <header className="topbar">
        <div className="topbar-content">
          <div className="brand">
            <div className="brand-icon">
              ₪
            </div>

            <div>
              <h1>ניהול התקציב</h1>

              <span>
                מערכת לניהול ומעקב פיננסי
              </span>
            </div>
          </div>

          <div className="topbar-date">
            <span>היום</span>

            <strong>
              {new Date().toLocaleDateString(
                "he-IL"
              )}
            </strong>
          </div>
        </div>
      </header>

      {/* NAVIGATION */}

      <nav className="navigation">
        <button
          className={`nav-button ${
            currentPage === "home"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setCurrentPage("home")
          }
        >
          🏠 בית
        </button>

        <button
          className={`nav-button ${
            currentPage === "reports"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setCurrentPage("reports")
          }
        >
          📊 דוחות
        </button>
      </nav>

      {/* MAIN */}

      <main className="main-container">
        {currentPage === "home"
          ? renderHome()
          : renderReports()}
      </main>

      {/* ADD TRANSACTION MODAL */}

      {isModalOpen && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setIsModalOpen(false);
            }
          }}
        >
          <div
            className="transaction-modal"
            dir="rtl"
          >
            <div className="modal-header">
              <div>
                <span>תנועה חדשה</span>

                <h2>
                  הוספת תנועה
                </h2>
              </div>

              <button
                className="close-button"
                onClick={() =>
                  setIsModalOpen(false)
                }
              >
                ×
              </button>
            </div>

            {/* TYPE */}

            <label>
              סוג תנועה
            </label>

            <div className="type-selector">
              <button
                type="button"
                className={`type-button ${
                  type === "Expense"
                    ? "selected-expense"
                    : ""
                }`}
                onClick={() =>
                  setType("Expense")
                }
              >
                ↓ הוצאה
              </button>

              <button
                type="button"
                className={`type-button ${
                  type === "Income"
                    ? "selected-income"
                    : ""
                }`}
                onClick={() =>
                  setType("Income")
                }
              >
                ↑ הכנסה
              </button>
            </div>

            {/* CATEGORY */}

            <label>
              קטגוריה
            </label>

            <select
              className="modal-input"
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
            >
              {categories.map(
                (categoryItem) => (
                  <option
                    key={
                      categoryItem.name
                    }
                    value={
                      categoryItem.name
                    }
                  >
                    {categoryItem.icon}{" "}
                    {categoryItem.label}
                  </option>
                )
              )}
            </select>

            {/* TITLE */}

            <label>
              תיאור
            </label>

            <input
              className="modal-input"
              type="text"
              placeholder="לדוגמה: קניות בסופר"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
            />

            {/* AMOUNT */}

            <label>
              סכום
            </label>

            <div className="amount-input-wrapper">
              <span>₪</span>

              <input
                className="amount-input"
                type="number"
                min="1"
                placeholder="0"
                value={amount}
                onChange={(event) =>
                  setAmount(
                    event.target.value
                  )
                }
              />
            </div>

            {/* SUBMIT */}

            <button
              className="submit-transaction"
              onClick={addTransaction}
              disabled={saving}
            >
              {saving
                ? "שומר..."
                : "הוסף תנועה"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;