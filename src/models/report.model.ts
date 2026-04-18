import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  anonId: String,
  type: String,
  description: String,
  city: String,
  deposit: Number,
  file: String,
  status: {
    type: String,
    default: "Under Review"
  }
}, { timestamps: true });

export default mongoose.model("Report", reportSchema);