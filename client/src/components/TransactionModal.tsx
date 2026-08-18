type TransactionModalProps = {
  isOpen: boolean;
  title: string;
  amount: string;
  type: "Income" | "Expense";
  category: string;

  setTitle: (value: string) => void;
  setAmount: (value: string) => void;
  setType: (value: "Income" | "Expense") => void;
  setCategory: (value: string) => void;

  onAdd: () => void;
  onClose: () => void;
};

function TransactionModal({
  isOpen,
  title,
  amount,
  type,
  category,
  setTitle,
  setAmount,
  setType,
  setCategory,
  onAdd,
  onClose,
}: TransactionModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="transaction-modal"
        dir="rtl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="modal-label">ניהול תקציב</p>
            <h2>הוספת תנועה</h2>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
            aria-label="סגירת חלונית"
          >
            ×
          </button>
        </div>

        <div className="form-group">
          <label>סוג</label>

          <div className="transaction-type">
            <button
              type="button"
              className={type === "Expense" ? "type-button expense-selected" : "type-button"}
              onClick={() => setType("Expense")}
            >
              הוצאה
            </button>

            <button
              type="button"
              className={type === "Income" ? "type-button income-selected" : "type-button"}
              onClick={() => setType("Income")}
            >
              הכנסה
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>קטגוריה</label>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="Food">מזון</option>
            <option value="Entertainment">בילויים</option>
            <option value="Fuel">תחבורה</option>
            <option value="Education">חינוך</option>
            <option value="Other">אחר</option>
          </select>
        </div>

        <div className="form-group">
          <label>תיאור</label>

          <input
            type="text"
            placeholder="למשל: קניות בסופר"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label>סכום</label>

          <div className="amount-input">
            <span>₪</span>

            <input
              type="number"
              placeholder="0.00"
              min="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
        </div>

        <button className="modal-submit" onClick={onAdd}>
          הוסף תנועה
        </button>
      </div>
    </div>
  );
}

export default TransactionModal;