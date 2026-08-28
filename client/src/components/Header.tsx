function Header() {
  return (
    <header className="header">
      <div className="header-content">

        <div className="header-title">

          <div className="header-icon">
            ₪
          </div>

          <div>
            <h1>ניהול התקציב</h1>

            <p>
              שליטה חכמה בהכנסות ובהוצאות שלך
            </p>
          </div>

        </div>

        <div className="header-date">

          <span>היום</span>

          <strong>
            {new Date().toLocaleDateString("he-IL")}
          </strong>

        </div>

      </div>
    </header>
  );
}

export default Header;