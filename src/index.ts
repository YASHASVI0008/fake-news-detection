import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import reportRoutes from "./routes/report.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/reports", reportRoutes);

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

app.get("/", (req, res) => {
  res.send("🚀 SafeWitness Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});