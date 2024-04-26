const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesControllers');
const articlesController = require('./articles/Articles.Controller');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('body-parser', bodyParser.urlencoded({ extended: false }));
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

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(8080, () => {
  console.log('Servidor iniciado com sucesso !');
});
