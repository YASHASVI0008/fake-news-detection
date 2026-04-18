import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

import Report from "../models/report.model";
import { generateAnonId } from "../utils/anon";

const router = express.Router();

// ✅ FILE STORAGE CONFIG
const storage = multer.diskStorage({
destination: "uploads/",
filename: (req, file, cb) => {
cb(null, uuidv4()); // random file name
}
});

const upload = multer({ storage });

// ✅ CREATE REPORT
router.post("/create", upload.single("file"), async (req: any, res) => {
try {
const report = await Report.create({
anonId: generateAnonId(),
type: req.body.type,
description: req.body.description,
city: req.body.city,
deposit: req.body.deposit,
file: req.file ? req.file.filename : null,
status: "Under Review"
});


console.log("✅ Report created:", report._id);

// 🤖 FAKE AI (auto verify after 3 sec)
setTimeout(async () => {
  try {
    let result = "Suspicious";

    if (report.description && report.description.length > 15) {
      result = "Verified";
    }

    await Report.findByIdAndUpdate(report._id, {
      status: result
    });

    console.log("🤖 AI RESULT:", result);

  } catch (err) {
    console.log("❌ AI ERROR:", err);
  }
}, 3000);

res.json(report);


} catch (err) {
console.log("❌ CREATE ERROR:", err);
res.status(500).json({ error: "Failed to create report" });
}
});

// ✅ GET ALL REPORTS
router.get("/all", async (req, res) => {
try {
const reports = await Report.find().sort({ createdAt: -1 });
res.json(reports);
} catch (err) {
res.status(500).json({ error: "Failed to fetch reports" });
}
});

export default router;
