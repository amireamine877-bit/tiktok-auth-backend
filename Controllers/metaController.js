const metaService = require('../services/metaService');

// Called by dashboard/admin to request fetch
exports.fetchAccountInsights = async (req, res) => {
  try {
    const { accountId } = req.body;
    if (!accountId) return res.status(400).json({ error: 'accountId required' });
    const data = await metaService.fetchInsights(accountId);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Called by MAKE to save processed insights
exports.saveInsights = async (req, res) => {
  try {
    const payload = req.body;
    // TODO: persist to DB (Supabase/Postgres)
    console.log('Received insights from MAKE:', payload);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
