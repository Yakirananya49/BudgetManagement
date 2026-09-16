import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";

type TransactionType = "income" | "expense";

type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
};

type User = {
  id: string;
  name: string;
  email: string;
};

function App() {

  // =========================
  // AUTH
  // =========================

  const [user, setUser] = useState<User | null>(() => {
    const savedUser =
      localStorage.getItem("authUser");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  // =========================
  // PAGE
  // =========================

  const [currentPage, setCurrentPage] =
    useState("dashboard");

  // =========================
  // LOGIN
  // =========================

  const handleLogin = (
    loggedInUser: User,
    token: string
  ) => {

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "authUser",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);

    setCurrentPage("dashboard");
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("authUser");

    localStorage.removeItem("userName");

    localStorage.removeItem("userEmail");

    setUser(null);

    setCurrentPage("dashboard");
  };

  // =========================
  // TRANSACTIONS
  // =========================

  const [transactions, setTransactions] =
    useState<Transaction[]>([
      {
        id: 1,
        title: "קניות בסופר",
        amount: 250,
        type: "expense",
        category: "מזון",
      },
      {
        id: 2,
        title: "משכורת",
        amount: 5000,
        type: "income",
        category: "שכר",
      },
      {
        id: 3,
        title: "דלק",
        amount: 300,
        type: "expense",
        category: "תחבורה",
      },
      {
        id: 4,
        title: "בילוי",
        amount: 180,
        type: "expense",
        category: "בילויים",
      },
    ]);

  // =========================
  // BUDGET
  // =========================

  const [budget] = useState(10000);

  // =========================
  // MODAL
  // =========================

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [type, setType] =
    useState<TransactionType>("expense");

  const [category, setCategory] =
    useState("מזון");

  // =========================
  // ADD TRANSACTION
  // =========================

  const addTransaction = () => {

    if (!title.trim()) {
      alert("נא להזין תיאור לתנועה");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("נא להזין סכום גדול מ־0");
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
    };

    setTransactions((previous) => [
      newTransaction,
      ...previous,
    ]);

    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("מזון");

    setIsModalOpen(false);
  };

  // =========================
  // DELETE TRANSACTION
  // =========================

  const handleDelete = (id: number) => {

    setTransactions((previous) =>
      previous.filter(
        (transaction) =>
          transaction.id !== id
      )
    );
  };

  // =========================
  // OPEN MODAL
  // =========================

  const openAddTransaction = () => {
    setIsModalOpen(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // =========================
  // AUTH SCREEN
  // =========================

  if (!user) {
    return (
      <Auth
        onLogin={handleLogin}
      />
    );
  }

  // =========================
  // MAIN APP
  // =========================

  return (
    <div className="app">

      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <main className="main-content">

        {/* HOME */}

        {currentPage === "dashboard" && (
          <Dashboard
            transactions={transactions}
            budget={budget}
            onAddTransaction={
              openAddTransaction
            }
          />
        )}

        {/* TRANSACTIONS */}

        {currentPage === "transactions" && (
          <Transactions
            transactions={transactions}
            onDelete={handleDelete}
          />
        )}

        {/* REPORTS */}

        {currentPage === "reports" && (
          <Reports
            transactions={transactions}
          />
        )}

        {/* PROFILE */}

        {currentPage === "profile" && (
          <Profile
            user={user}
            onLogout={handleLogout}
          />
        )}

      </main>

      {/* =========================
          ADD TRANSACTION MODAL
      ========================= */}

      {isModalOpen && (

        <div
          className="modal-overlay"
          onClick={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }

          }}
        >

          <div className="transaction-modal">

            <div className="modal-header">

              <div>

                <span className="modal-subtitle">
                  תנועה חדשה
                </span>

                <h2>
                  הוספת תנועה
                </h2>

              </div>

              <button
                type="button"
                className="close-button"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            {/* TYPE */}

            <div className="modal-field">

              <label>
                סוג תנועה
              </label>

              <div className="type-selector">

                <button
                  type="button"
                  className={
                    type === "expense"
                      ? "type-button selected-expense"
                      : "type-button"
                  }
                  onClick={() =>
                    setType("expense")
                  }
                >
                  ↓ הוצאה
                </button>

                <button
                  type="button"
                  className={
                    type === "income"
                      ? "type-button selected-income"
                      : "type-button"
                  }
                  onClick={() =>
                    setType("income")
                  }
                >
                  ↑ הכנסה
                </button>

              </div>

            </div>

            {/* CATEGORY */}

            <div className="modal-field">

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

                <option value="כלכלה">
                  🍔 כלכלה
                </option>

                <option value="פנאי">
                  🎮 פנאי
                </option>

                <option value="דלק">
                  🚗 דלק
                </option>

                <option value="משכורת">
                  💰 משכורת
                </option>

                <option value="אחר">
                  📦 אחר
                </option>

              </select>

            </div>

            {/* TITLE */}

            <div className="modal-field">

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

            </div>

            {/* AMOUNT */}

            <div className="modal-field">

              <label>
                סכום
              </label>

              <div className="amount-input-wrapper">

                <span>
                  ₪
                </span>

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

            </div>

            {/* SUBMIT */}

            <button
              type="button"
              className="submit-transaction"
              onClick={addTransaction}
            >
              הוסף תנועה
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;