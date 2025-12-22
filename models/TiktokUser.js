import mongoose from "mongoose";

const TiktokUserSchema = new mongoose.Schema({
  user_id: { type: String, required: true }, // ID من منصة TikTok أو مستخدمك
  
  access_token: { type: String, required: true },
  refresh_token: { type: String },
  expires_in: { type: Number },

  advertiser_ids: [{ type: String }], // لاحقًا نضيفها بعد جلب الحسابات الإعلانية

  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("TiktokUser", TiktokUserSchema);
