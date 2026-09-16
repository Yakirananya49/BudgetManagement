type User = {
  id: string;
  name: string;
  email: string;
};

type ProfileProps = {
  user: User;
  onLogout: () => void;
};

function Profile({
  user,
  onLogout,
}: ProfileProps) {

  return (
    <div className="profile-page">

      <div className="page-title">

        <h1>
          הפרופיל שלי 👤
        </h1>

        <p>
          פרטי המשתמש והחשבון
        </p>

      </div>

      <div className="profile-card">

        <div className="profile-avatar">
          👤
        </div>

        <h2>
          {user.name}
        </h2>

        <p>
          {user.email}
        </p>

        <div className="profile-details">

          <div>

            <span>
              שם משתמש
            </span>

            <strong>
              {user.name}
            </strong>

          </div>

          <div>

            <span>
              אימייל
            </span>

            <strong>
              {user.email}
            </strong>

          </div>

        </div>

        <div className="profile-auth-status">
          🔒 החשבון מחובר
        </div>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          🚪 התנתקות
        </button>

      </div>

    </div>
  );
}

export default Profile;