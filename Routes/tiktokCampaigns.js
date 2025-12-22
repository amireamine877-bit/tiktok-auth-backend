import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/campaigns", async (req, res) => {
  try {
    const { access_token, advertiser_id } = req.query;

    if (!access_token || !advertiser_id) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    const response = await axios.get(
      "https://business-api.tiktok.com/open_api/v1.3/campaign/get/",
      {
        headers: {
          "Access-Token": access_token,
        },
        params: {
          advertiser_id,
        },
      }
    );

    console.log("📊 TikTok Campaigns Response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching campaigns:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching campaigns" });
  }
});

export default router;
