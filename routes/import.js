const express = require('express');
const { sync, importAll } = require('../sync.js');
const validator = require('../validator');
const { splitUrlParam } = require('../util');

const router = express.Router();

router.use(validator);

router.post('/', async (req, res) => {
  try {
    const { movie: { id = '' } } = req.body;
    const resolutions = splitUrlParam(req, 'resolutions');
    const response = await sync({ id, resolutions });
    res.send(response);
  } catch (e) {
    const message = 'Malformed webhook request';
    console.log(message, req.body);
    res.status(400).send(message);
  }
});

router.post('/all', async (req, res) => {
  const resolutions = splitUrlParam(req, 'resolutions');
  const response = await importAll({ resolutions });
  res.send(response);
});

router.post('/:id', async (req, res) => {
  const resolutions = splitUrlParam(req, 'resolutions');
  const { id } = req.params;
  const response = await sync({ id, resolutions });
  res.send(response);
});

module.exports = router;
