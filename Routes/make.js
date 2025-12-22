const express = require('express');
const router = express.Router();
const makeController = require('../controllers/makeController');

// Endpoint for MAKE to call when scenario finishes analysis
router.post('/webhook', makeController.handleWebhook);

// Endpoint to trigger a MAKE scenario (optionally)
router.post('/trigger', makeController.triggerScenario);

module.exports = router;
