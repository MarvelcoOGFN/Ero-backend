const express = require('express');
const router = express.Router();
const functions = require('../structs/functions.js');

router.get('/content/api/pages/*', async (req, res) => {
  const contentPages = functions.getContentPages(req);

  res.json(contentPages);
});

module.exports = router;
