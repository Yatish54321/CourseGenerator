const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'API root' }));

// Mount MCP connector routes
router.use('/mcp', require('./mcp'));

router.use('/course', require('./course'));

module.exports = router;
