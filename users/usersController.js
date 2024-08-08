const express = require('express');
const router = express.Router();
const User = require('./User');

router.get('/admin/users', async (req, res) => {
  res.send('listagem de usuarios');
});

router.get('/admin/users/create', (req, res) => {
  res.render('./admin/users/create');
});

router.post('/users/create', async (req, res) => {
  const { password, email } = req.body;

  res.json({ password, email });
});

module.exports = router;
