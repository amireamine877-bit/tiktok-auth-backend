// Handle incoming webhook from MAKE (analysis results)
exports.handleWebhook = async (req, res) => {
  try {
    const body = req.body;
    // verify secret if provided (simple example)
    const secret = req.headers['x-make-secret'] || req.body.secret;
    if (process.env.MAKE_WEBHOOK_SECRET && secret !== process.env.MAKE_WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Invalid secret' });
    }
    console.log('MAKE webhook payload:', body);
    // Here you would parse body and save to DB, or forward to frontend via socket
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.triggerScenario = async (req, res) => {
  try {
    // optional: make HTTP call to Make scenario to trigger analysis
    res.json({ ok: true, msg: 'trigger endpoint placeholder' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
