import express from "express";
import { getGoogleAdsCampaigns } from "../../Services/googleAds.js";

const router = express.Router();

router.get("/campaigns", async (req, res) => {
  try {
    const { customerId } = req.query;
    const data = await getGoogleAdsCampaigns(customerId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
