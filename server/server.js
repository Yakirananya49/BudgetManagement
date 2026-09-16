const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();
const PORT = 5000;

// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());

// =========================
// DATABASE
// =========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error
    );
  });

// =========================
// USER SCHEMA
// =========================

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

// =========================
// TRANSACTION SCHEMA
// =========================

const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  type: {
    type: String,
    enum: ["Income", "Expense"],
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema
);

// =========================
// JWT SECRET
// =========================

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "budget-management-secret-2026";

// =========================
// REGISTER
// =========================

app.post(
  "/api/auth/register",
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      // בדיקת שדות
      if (
        !name ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          message:
            "נא למלא את כל השדות",
        });
      }

      // בדיקת אורך סיסמה
      if (password.length < 6) {
        return res.status(400).json({
          message:
            "הסיסמה חייבת להכיל לפחות 6 תווים",
        });
      }

      // ניקוי האימייל
      const normalizedEmail =
        email.trim().toLowerCase();

      // בדיקה האם המשתמש כבר קיים
      const existingUser =
        await User.findOne({
          email: normalizedEmail,
        });

      if (existingUser) {
        return res.status(400).json({
          message:
            "כתובת האימייל כבר קיימת במערכת",
        });
      }

      // הצפנת הסיסמה
      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      // יצירת משתמש
      const newUser = new User({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      });

      // שמירה ב-MongoDB
      await newUser.save();

      console.log(
        "New user registered:",
        normalizedEmail
      );

      return res.status(201).json({
        message:
          "ההרשמה הצליחה",
      });

    } catch (error) {
      console.error(
        "Register error:",
        error
      );

      return res.status(500).json({
        message:
          "שגיאה בהרשמה",
      });
    }
  }
);

// =========================
// LOGIN
// =========================

app.post(
  "/api/auth/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      // בדיקת שדות
      if (
        !email ||
        !password
      ) {
        return res.status(400).json({
          message:
            "נא למלא אימייל וסיסמה",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      // חיפוש משתמש
      const user =
        await User.findOne({
          email: normalizedEmail,
        });

      if (!user) {
        return res.status(401).json({
          message:
            "אימייל או סיסמה שגויים",
        });
      }

      // בדיקת הסיסמה
      const isPasswordCorrect =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          message:
            "אימייל או סיסמה שגויים",
        });
      }

      // יצירת JWT
      const token =
        jwt.sign(
          {
            userId: user._id.toString(),
          },
          JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

      console.log(
        "User logged in:",
        normalizedEmail
      );

      return res.json({
        message:
          "התחברות הצליחה",

        token,

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      return res.status(500).json({
        message:
          "שגיאה בהתחברות",
      });
    }
  }
);

// =========================
// AUTH MIDDLEWARE
// =========================

async function authenticateToken(
  req,
  res,
  next
) {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message:
          "Access token required",
      });
    }

    const parts =
      authHeader.split(" ");

    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer"
    ) {
      return res.status(401).json({
        message:
          "Invalid authorization format",
      });
    }

    const token = parts[1];

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );

    const user =
      await User.findById(
        decoded.userId
      ).select("-password");

    if (!user) {
      return res.status(401).json({
        message:
          "User not found",
      });
    }

    req.user = user;

    next();

  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      message:
        "Invalid or expired token",
    });
  }
}

// =========================
// GET CURRENT USER
// =========================

app.get(
  "/api/auth/me",
  authenticateToken,
  (req, res) => {
    return res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  }
);

// =========================
// GET TRANSACTIONS
// =========================

app.get(
  "/api/transactions",
  async (req, res) => {
    try {
      const transactions =
        await Transaction.find()
          .sort({
            date: -1,
          });

      return res.json(
        transactions
      );

    } catch (error) {
      console.error(
        "Get transactions error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to get transactions",
      });
    }
  }
);

// =========================
// ADD TRANSACTION
// =========================

app.post(
  "/api/transactions",
  async (req, res) => {
    try {
      const transaction =
        new Transaction(
          req.body
        );

      const savedTransaction =
        await transaction.save();

      return res.status(201).json(
        savedTransaction
      );

    } catch (error) {
      console.error(
        "Create transaction error:",
        error
      );

      return res.status(400).json({
        message:
          "Failed to create transaction",
      });
    }
  }
);

// =========================
// DELETE TRANSACTION
// =========================

app.delete(
  "/api/transactions/:id",
  async (req, res) => {
    try {
      await Transaction.findByIdAndDelete(
        req.params.id
      );

      return res.json({
        message:
          "Transaction deleted successfully",
      });

    } catch (error) {
      console.error(
        "Delete transaction error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to delete transaction",
      });
    }
  }
);

// =========================
// SERVER
// =========================

app.listen(
  PORT,
  () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );
  }
);