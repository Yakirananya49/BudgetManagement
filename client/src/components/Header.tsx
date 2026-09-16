type HeaderProps = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

function Header({
  currentPage,
  setCurrentPage,
}: HeaderProps) {
  return (
    <header className="header">

      {/* Logo */}

      <div
        className="logo"
        onClick={() => setCurrentPage("dashboard")}
      >
        <div className="logo-icon">
          💰
        </div>

        <div className="logo-text">
          <strong>ניהול תקציב</strong>

          <span>
            הכסף שלך בשליטה
          </span>
        </div>
      </div>

      {/* Navigation */}

      <nav className="navigation">

        <button
          className={
            currentPage === "dashboard"
              ? "active"
              : ""
          }
          onClick={() =>
            setCurrentPage("dashboard")
          }
        >
          <span>🏠</span>
          ראשי
        </button>

        <button
          className={
            currentPage === "transactions"
              ? "active"
              : ""
          }
          onClick={() =>
            setCurrentPage("transactions")
          }
        >
          <span>💳</span>
          תנועות
        </button>

        <button
          className={
            currentPage === "reports"
              ? "active"
              : ""
          }
          onClick={() =>
            setCurrentPage("reports")
          }
        >
          <span>📊</span>
          דוחות
        </button>

        <button
          className={
            currentPage === "profile"
              ? "active"
              : ""
          }
          onClick={() =>
            setCurrentPage("profile")
          }
        >
          <span>👤</span>
          משתמש
        </button>

      </nav>

      {/* User area */}

      <div className="header-user">

        <div className="header-user-avatar">
          👤
        </div>

        <div className="header-user-text">
          <strong>המשתמש שלי</strong>
          <span>חשבון אישי</span>
        </div>

      </div>

    </header>
  );
}

export default Header;