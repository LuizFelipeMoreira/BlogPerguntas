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

    res.redirect('/admin/categories');
  } else {
    console.log('erro, nop calvo');
    res.redirect('/admin/categories/new');
  }
});

router.get('/admin/categories', async (req, res) => {
  const categories = await Category.findAll({ raw: true });

  res.render('admin/categories/index', { categories });
});

router.post('/categories/delete', async (req, res) => {
  const { id } = req.body;
  const checkId = !isNaN(id) && id !== undefined;

  if (checkId) {
    await Category.destroy({ where: { id: id } });
    res.redirect('/admin/categories');
  } else {
    res.redirect('/admin/categories');
  }
});

router.get('/admin/categories/edit/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.redirect('/admin/categories');
  }

  try {
    const category = await Category.findByPk(id);

    if (category !== undefined) {
      res.render('admin/categories/edit', { category });
    } else {
      res.redirect('/admin/categories');
    }
  } catch (error) {
    res.redirect('/admin/categories');
  }
});

router.post('/categories/update', async (req, res) => {
  const { id, title } = req.body;
  const checkId = !isNaN(id) && id !== undefined;

  try {
    await Category.update(
      { title, slug: slugify(title) },
      {
        where: {
          id,
        },
      }
    );

    res.redirect('/admin/categories');
  } catch (error) {}
});
module.exports = router;
