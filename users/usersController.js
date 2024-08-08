const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');

router.get('/admin/users', async (req, res) => {
  res.send('listagem de usuarios');
});

router.get('/admin/users/create', (req, res) => {
  res.render('./admin/users/create');
});

router.post('/users/create', async (req, res) => {
  const { password, email } = req.body;

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await User.create({ email, password: hash });

    res.redirect('/');
  } catch (error) {
    res.redirect('/');
  }
});

module.exports = router;
