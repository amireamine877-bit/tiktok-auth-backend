const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/list', requireAuth, reportController.listReports);
router.post('/generate', requireAuth, reportController.generateReport);
router.post('/save', reportController.saveReportFromMake);

module.exports = router;
