const mcpService = require('../services/mcpService');

exports.fetchByTopic = async (req, res, next) => {
  try {
    const { topic, sources, url } = req.body;
    if (!topic && !url) return res.status(400).json({ error: 'Provide topic or url' });

    const results = await mcpService.fetchContent({ topic, sources, url });
    res.json({ topic: topic || null, url: url || null, sourcesRequested: sources || null, results });
  } catch (err) {
    next(err);
  }
};
