const tiktokService = require('../services/tiktokService');

exports.fetchAccountInsights = async (req, res) => {
  try {
    const { accountId } = req.body;
    if (!accountId) return res.status(400).json({ error: 'accountId required' });
    const data = await tiktokService.fetchInsights(accountId);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveInsights = async (req, res) => {
  try {
    console.log('TikTok insights saved:', req.body);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
