const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');

router.get('/admin/users', async (req, res) => {
  const users = await User.findAll({ raw: true });
  res.render('./admin/users/index', { users });
});

router.get('/admin/users/create', (req, res) => {
  res.render('./admin/users/create');
});

router.post('/users/create', async (req, res) => {
  const { password, email } = req.body;

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const userExistent = User.findOne({ where: { email } });

    if (userExistent === undefined) {
      await User.create({ email, password: hash });
      res.redirect('/');
    } else {
      res.redirect('/admin/users/create');
    }
  } catch (error) {
    res.redirect('/');
  }
});

module.exports = router;
