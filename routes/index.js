const express = require('express');
const { sync, importAll } = require('../sync.js');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.send('Radarr Sync Webhook');
});

router.post('/import', async (req, res) => {
  const { movie: { id } } = req.body;
  const response = await sync(id);
  res.send(response);
});

router.post('/import/:id', async (req, res) => {
  const { id } = req.params;
  const response = await sync(id);
  res.send(response);
});

router.post('/import_all', async (req, res) => {
  const response = await importAll();
  res.send(response);
});

module.exports = router;
