import { useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthProps = {
  onLogin: (user: User, token: string) => void;
};

function Auth({ onLogin }: AuthProps) {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");

    if (isRegister && !name.trim()) {
      setError("נא להזין שם משתמש");
      return;
    }

    if (!email.trim()) {
      setError("נא להזין כתובת אימייל");
      return;
    }

    if (!password) {
      setError("נא להזין סיסמה");
      return;
    }

    if (isRegister && password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isRegister
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

      const body = isRegister
        ? {
            name: name.trim(),
            email: email.trim(),
            password,
          }
        : {
            email: email.trim(),
            password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "אירעה שגיאה"
        );
      }

      if (isRegister) {
        alert("ההרשמה הצליחה! עכשיו ניתן להתחבר.");

        setIsRegister(false);
        setName("");
        setPassword("");
        setError("");
      } else {
        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "authUser",
          JSON.stringify(data.user)
        );

        onLogin(data.user, data.token);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("לא ניתן להתחבר לשרת");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-icon">
          💰
        </div>

        <h1>
          ניהול תקציב אישי 
        </h1>

        <p className="auth-subtitle">
          {isRegister
            ? "יצירת חשבון חדש"
            : "התחברות לחשבון שלך"}
        </p>

        <form onSubmit={handleSubmit}>

          {isRegister && (
            <div className="auth-field">

              <label>
                שם משתמש
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="הזן את שמך"
              />

            </div>
          )}

          <div className="auth-field">

            <label>
              כתובת אימייל
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="example@gmail.com"
            />

          </div>

          <div className="auth-field">

            <label>
              סיסמה
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="לפחות 6 תווים"
            />

          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "טוען..."
              : isRegister
              ? "📝 יצירת חשבון"
              : "🔐 התחברות"}
          </button>

        </form>

        <div className="auth-switch">

          {isRegister
            ? "כבר יש לך חשבון?"
            : "אין לך עדיין חשבון?"}

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setPassword("");
            }}
          >
            {isRegister
              ? "התחברות"
              : "הרשמה"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Auth;