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

    const userExistent = await User.findOne({ where: { email } });

    if (!userExistent) {
      await User.create({ email, password: hash });
      res.redirect('/');
    } else {
      res.redirect('/admin/users/create');
    }
  } catch (error) {
    res.redirect('/');
  }
});

router.get('/login', async (req, res) => {
  res.render('./admin/users/login');
});

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user !== undefined) {
      const correct = bcrypt.compareSync(password, user.password);

      if (correct) {
        req.session.user = {
          id: user.id,
          email: user.email,
        };
        req.json(req.session.user);
      } else {
        res.redirect('/login');
      }
    } else {
      res.redirect('/login');
    }
  } catch (error) {}
});
module.exports = router;
