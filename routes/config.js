const express = require('express');
const router = express.Router();
const { generateKeys, buildWGConfig } = require('../utils/wireguard');

router.post('/generate', (req, res) => {
  try {
    const keys = generateKeys();
    const config = buildWGConfig(keys);

    res.json({
      config,
      keys,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate config' });
  }
});

module.exports = router;
