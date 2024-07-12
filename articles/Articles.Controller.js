const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');

router.get('/admin/articles', (req, res) => {
  res.send('Rota de Artigos');
});

router.get('/admin/articles/new', async (req, res) => {
  const categories = await Category.findAll();

  res.render('./admin/articles/new', { categories });
});

router.post('/articles/save', async (req, res) => {
  const { title, body, category } = req.body;

  try {
    await Article.create({
      title,
      slug: slugify(title),
      body,
      categoryId: category,
    });

    res.redirect('/admin/articles');
  } catch (error) {
    res.send(`<h1>${error}</h1>`);
  }
});

module.exports = router;
