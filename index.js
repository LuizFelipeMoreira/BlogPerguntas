const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesControllers');
const articlesController = require('./articles/Articles.Controller');

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const { where } = require('sequelize');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

(async () => {
  try {
    await connection.authenticate();
    console.log('Conexao feita com sucesso !');
  } catch (error) {
    console.log(error);
  }
})();

app.use('/', categoriesController);
app.use('/', articlesController);

app.get('/', async (req, res) => {
  const articles = await Article.findAll({ order: [['id', 'DESC']], limit: 4 });
  const categories = await Category.findAll();

  res.render('index', { articles, categories });
});

app.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const article = await Article.findOne({ where: { slug } });
    const categories = await Category.findAll();

    if (article !== undefined) {
      res.render('article', { article, categories });
    } else {
      res.redirect('/');
    }
  } catch (error) {
    res.redirect('/');
  }
});

app.get('/category/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const categorie = await Category.findOne({
      where: { slug },
      include: [{ model: Article }],
    });

    if (categorie) {
      console.log('entrou no if');
    }

    if (categorie !== undefined) {
      const categories = await Category.findAll({
        incude: [{ model: Article }],
      });

      res.render('index', { categories, articles: categorie.articles });
    } else {
      res.redirect('/');
    }
  } catch (error) {}
});

app.listen(8080, () => {
  console.log('Servidor iniciado com sucesso !');
});
