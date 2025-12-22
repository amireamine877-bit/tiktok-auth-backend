import express from "express";
import { getMetaCampaigns } from "../../Services/metaAds.js";

const router = express.Router();

router.get("/campaigns", async (req, res) => {
  try {
    const { token, accountId } = req.query;
    const data = await getMetaCampaigns(token, accountId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
