const dns = require("dns");
dns.setServers(["8.8.8.8"]);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

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

// GET - קבלת כל העסקאות
app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({
      date: -1,
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get transactions",
    });
  }
});

// POST - הוספת עסקה
app.post("/api/transactions", async (req, res) => {
  try {
    const transaction = new Transaction(req.body);

    const savedTransaction = await transaction.save();

    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create transaction",
    });
  }
});

// DELETE - מחיקת עסקה
app.delete("/api/transactions/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);

    res.json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete transaction",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});