import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/advertisers", async (req, res) => {
  try {
    const { access_token } = req.query;

    if (!access_token) {
      return res.status(400).json({ message: "Missing access_token" });
    }

    const response = await axios.get(
      "https://business-api.tiktok.com/open_api/v1.3/oauth2/advertiser/get/",
      {
        headers: {
          "Access-Token": access_token,
        },
      }
    );

    console.log("📊 TikTok Advertisers Response:", response.data);

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching advertisers" });
  }
});

export default router;
