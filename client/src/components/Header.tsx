function Header() {
  return (
    <header className="top-header">
      <div className="brand">
        <div className="brand-icon">₪</div>

        <div>
          <h1>ניהול התקציב</h1>
          <p>ניהול חכם של ההכנסות וההוצאות שלך</p>
        </div>
      </div>

      <div className="header-date">
        <span>היום</span>
        <strong>
          {new Date().toLocaleDateString("he-IL")}
        </strong>
      </div>
    </header>
  );
}

export default Header;