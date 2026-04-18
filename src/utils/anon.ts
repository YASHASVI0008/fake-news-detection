import crypto from "crypto";

export function generateAnonId() {
  return "SW-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}