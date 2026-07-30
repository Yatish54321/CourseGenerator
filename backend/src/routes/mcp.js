const express = require('express');
const router = express.Router();
const mcpController = require('../controllers/mcpController');

// POST /api/mcp/fetch
// body: { topic: string, sources?: ["mdn","freecodecamp","generic"], url?: string }
router.post('/fetch', mcpController.fetchByTopic);

module.exports = router;
