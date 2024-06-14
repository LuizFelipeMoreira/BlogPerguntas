const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');

router.get('/admin/categories/new', (req, res) => {
  res.render('admin/categories/new');
});

router.post('/categories/save', async (req, res) => {
  const { title } = req.body;
  console.log('chegou na rota');

  console.log(title);

  if (title) {
    await Category.create({ title, slug: slugify(title) });
  } else {
    console.log('erro, nop calvo');
    res.redirect('/admin/categories/new');
  }
});

module.exports = router;
