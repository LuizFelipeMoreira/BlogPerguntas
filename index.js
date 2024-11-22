const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const session = require('express-session');

const categoriesController = require('./categories/CategoriesControllers');
const articlesController = require('./articles/Articles.Controller');
const usersController = require('./users/usersController');

const Category = require('./categories/Category');
const Article = require('./articles/Article');
const User = require('./users/User');

app.use(
  session({
    secret: 'agfsdgfsg',
    cookie: { maxAge: 30000 },
  })
);

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
app.use('/', usersController);

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

    if (!article) res.redirect('/');

    res.render('article', { article, categories });
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

    if (!categorie) res.redirect('/');

    const categories = await Category.findAll({
      incude: [{ model: Article }],
    });

    res.render('index', { categories, articles: categorie.articles });
  } catch (error) {}
});

app.listen(8080, () => {
  console.log('Servidor iniciado com sucesso !');
});
