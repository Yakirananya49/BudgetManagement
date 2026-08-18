import { useEffect, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import TransactionCard from "./components/TransactionCard";
import Summary from "./components/Summary";
import TransactionModal from "./components/TransactionModal";

type Transaction = {
  _id: string;
  title: string;
  amount: number;
  type: "Income" | "Expense";
  category: string;
  date: string;
};

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"Income" | "Expense">("Expense");
  const [category, setCategory] = useState("Food");

  const [isModalOpen, setIsModalOpen] = useState(false);

  // קבלת העסקאות מ-MongoDB
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/transactions"
        );

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error("Error loading transactions:", error);
        setTransactions([]);
      }
    };

    loadTransactions();
  }, []);

  // פתיחת החלונית
  const openModal = () => {
    setIsModalOpen(true);
  };

  // סגירת החלונית
  const closeModal = () => {
    setIsModalOpen(false);

    setTitle("");
    setAmount("");
    setType("Expense");
    setCategory("Food");
  };

  // הוספת עסקה
  const addTransaction = async () => {
    if (!title.trim() || !amount || Number(amount) <= 0) {
      alert("נא למלא תיאור וסכום תקין");
      return;
    }

    const newTransaction = {
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTransaction),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }

      const savedTransaction = await response.json();

      setTransactions((prev) => [
        savedTransaction,
        ...prev,
      ]);

      closeModal();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  // מחיקת עסקה
  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/transactions/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      setTransactions((prev) =>
        prev.filter(
          (transaction) => transaction._id !== id
        )
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // חישוב הכנסות
  const income = transactions
    .filter(
      (transaction) => transaction.type === "Income"
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  // חישוב הוצאות
  const expense = transactions
    .filter(
      (transaction) => transaction.type === "Expense"
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  const balance = income - expense;

  return (
    <div className="app" dir="rtl">

      <Header />

      <main className="dashboard">

        <section className="dashboard-header">
          <div>
            <span className="eyebrow">
              סקירה כללית
            </span>

            <h1>שלום 👋</h1>

            <p>
              הנה סקירה של המצב הפיננסי שלך
            </p>
          </div>

          <div className="current-balance">
            <span>יתרה נוכחית</span>

            <strong>
              ₪{balance.toLocaleString()}
            </strong>
          </div>
        </section>

        <Summary
          income={income}
          expense={expense}
        />

        <section className="budget-card">

          <div className="budget-header">
            <div>
              <span>תקציב חודשי</span>
              <h2>₪10,000</h2>
            </div>

            <div className="budget-used">
              ₪{expense.toLocaleString()} / ₪10,000
            </div>
          </div>

          <div className="progress-bar">
            <div
              className="progress-value"
              style={{
                width: `${Math.min(
                  (expense / 10000) * 100,
                  100
                )}%`,
              }}
            />
          </div>

          <div className="budget-footer">
            <span>
              נוצלו{" "}
              {Math.min(
                Math.round((expense / 10000) * 100),
                100
              )}
              %
            </span>

            <span>
              נותרו ₪
              {Math.max(
                10000 - expense,
                0
              ).toLocaleString()}
            </span>
          </div>

        </section>

        <section className="transactions-section">

          <div className="section-heading">
            <div>
              <span className="eyebrow">
                פעילות אחרונה
              </span>

              <h2>תנועות אחרונות</h2>
            </div>

            <span className="transaction-number">
              {transactions.length} תנועות
            </span>
          </div>

          <div className="transactions-list">

            {transactions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  ₪
                </div>

                <h3>אין עדיין תנועות</h3>

                <p>
                  לחץ על כפתור + כדי להוסיף את
                  התנועה הראשונה שלך.
                </p>
              </div>
            ) : (
              transactions.map((item) => (
                <TransactionCard
                  key={item._id}
                  title={item.title}
                  amount={item.amount}
                  type={item.type}
                  onDelete={() =>
                    deleteTransaction(item._id)
                  }
                />
              ))
            )}

          </div>

        </section>

      </main>

      {/* Floating Action Button */}

      <button
        className="floating-add"
        onClick={openModal}
        aria-label="הוספת תנועה"
      >
        +
      </button>

      {/* Add Transaction Modal */}

      <TransactionModal
        isOpen={isModalOpen}
        title={title}
        amount={amount}
        type={type}
        category={category}
        setTitle={setTitle}
        setAmount={setAmount}
        setType={setType}
        setCategory={setCategory}
        onAdd={addTransaction}
        onClose={closeModal}
      />

    </div>
  );
}

export default App;