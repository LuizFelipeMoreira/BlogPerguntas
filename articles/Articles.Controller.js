const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');

router.get('/admin/articles', async (req, res) => {
  const articles = await Article.findAll({
    include: [{ model: Category }],
  });

  res.render('./admin/articles/index', { articles });
});

router.get('/admin/articles/new', async (req, res) => {
  const categories = await Category.findAll();

  res.render('./admin/articles/new', { categories });
});

router.post('/articles/save', async (req, res) => {
  const { title, body, category } = req.body;

  console.log('chegou na rota');
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

router.post('/articles/delete', async (req, res) => {
  const { id } = req.body;
  const checkId = !isNaN(id) && id !== undefined;

  if (checkId) {
    await Article.destroy({ where: { id: id } });
    res.redirect('/admin/articles');
  } else {
    res.redirect('/admin/articles');
  }
});

module.exports = router;
