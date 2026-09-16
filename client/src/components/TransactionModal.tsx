type TransactionType = "income" | "expense";

type TransactionModalProps = {
  isOpen: boolean;
  title: string;
  amount: string;
  type: TransactionType;
  category: string;

  setTitle: (value: string) => void;
  setAmount: (value: string) => void;
  setType: (value: TransactionType) => void;
  setCategory: (value: string) => void;

  onClose: () => void;
  onSubmit: () => void;
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
  onClose,
  onSubmit,
}: TransactionModalProps) {

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >

      <div
        className="transaction-modal"
        dir="rtl"
      >

        {/* =========================
            HEADER
        ========================= */}

        <div className="modal-header">

          <div>

            <span className="modal-label">
              תנועה חדשה
            </span>

            <h2>
              הוספת תנועה
            </h2>

            <p>
              הוסף הכנסה או הוצאה לחשבון שלך
            </p>

          </div>


          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        {/* =========================
            TYPE
        ========================= */}

        <div className="modal-field">

          <label>
            סוג תנועה
          </label>


          <div className="transaction-types">

            {/* EXPENSE */}

            <button
              type="button"
              className={
                type === "expense"
                  ? "transaction-type active-expense"
                  : "transaction-type"
              }
              onClick={() =>
                setType("expense")
              }
            >

              <span className="type-icon">
                ↘
              </span>

              <span>
                <strong>
                  הוצאה
                </strong>

                <small>
                  כסף שיוצא
                </small>
              </span>

            </button>


            {/* INCOME */}

            <button
              type="button"
              className={
                type === "income"
                  ? "transaction-type active-income"
                  : "transaction-type"
              }
              onClick={() =>
                setType("income")
              }
            >

              <span className="type-icon">
                ↗
              </span>

              <span>
                <strong>
                  הכנסה
                </strong>

                <small>
                  כסף שנכנס
                </small>
              </span>

            </button>

          </div>

        </div>


        {/* =========================
            TITLE
        ========================= */}

        <div className="modal-field">

          <label>
            תיאור התנועה
          </label>

          <input
            className="modal-input"
            type="text"
            placeholder="לדוגמה: קניות בסופר"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />

        </div>


        {/* =========================
            AMOUNT
        ========================= */}

        <div className="modal-field">

          <label>
            סכום
          </label>

          <div className="modal-amount">

            <span>
              ₪
            </span>

            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
            />

          </div>

        </div>


        {/* =========================
            CATEGORY
        ========================= */}

        <div className="modal-field">

          <label>
            קטגוריה
          </label>

          <select
            className="modal-input"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >

            <option value="Food">
              🍔 כלכלה
            </option>

            <option value="Entertainment">
              🎮 פנאי
            </option>

            <option value="Fuel">
              🚗 דלק
            </option>

            <option value="Other">
              📦 אחר
            </option>

          </select>

        </div>


        {/* =========================
            BUTTONS
        ========================= */}

        <div className="modal-buttons">

          <button
            type="button"
            className="modal-cancel"
            onClick={onClose}
          >
            ביטול
          </button>


          <button
            type="button"
            className="modal-save"
            onClick={onSubmit}
          >
            ✓ הוספת תנועה
          </button>

        </div>

      </div>

    </div>
  );
}

export default TransactionModal;