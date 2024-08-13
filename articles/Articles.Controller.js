const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');
const adminAuth = require('../middlewares/login');

router.get('/admin/articles', adminAuth, async (req, res) => {
  const articles = await Article.findAll({
    include: [{ model: Category }],
  });

  res.render('./admin/articles/index', { articles });
});

router.get('/admin/articles/new', adminAuth, async (req, res) => {
  const categories = await Category.findAll();

  res.render('./admin/articles/new', { categories });
});

router.post('/articles/save', adminAuth, async (req, res) => {
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

router.post('/articles/delete', adminAuth, async (req, res) => {
  const { id } = req.body;
  const checkId = !isNaN(id) && id !== undefined;

  if (checkId) {
    await Article.destroy({ where: { id: id } });
    res.redirect('/admin/articles');
  } else {
    res.redirect('/admin/articles');
  }
});

router.get('/admin/articles/edit/:id', adminAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const categories = await Category.findAll();
    const article = await Article.findByPk(id);
    console.log(article.id);

    res.render('./admin/articles/edit', { categories, article });
  } catch (error) {
    console.log('falhou  mas tentou pilantra');
  }
});

router.post('/articles/update', adminAuth, async (req, res) => {
  const { id, title, body, category } = req.body;

  if (isNaN(id)) {
    res.redirect('/admin/articles');
  }

  try {
    await Article.update(
      { title, slug: slugify(title), body, category },
      { where: { id } }
    );

    res.redirect('/admin/articles');
  } catch (error) {
    res.send(error);
  }
});

router.get('/articles/pages/:num', async (req, res) => {
  const { num } = req.params;
  let offset = 0;

  if (isNaN(num) || num == 1) {
    offset = 0;
  } else {
    offset = (parseInt(num) - 1) * 4;
  }

  const { count, rows } = await Article.findAndCountAll({
    limit: 4,
    offset,
    order: [['id', 'DESC']],
  });
  const categories = await Category.findAll();

  console.log(offset);

  let next;
  if (offset + 4 >= count) {
    next = false;
  } else {
    next = true;
  }

  const result = { next, count, rows };

  res.render('admin/articles/page', {
    page: parseInt(num),
    categories,
    count,
    rows,
    next,
  });
});

module.exports = router;
