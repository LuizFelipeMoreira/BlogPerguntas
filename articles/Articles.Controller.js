const express = require('express');
const router = express.Router();

router.get('/articles', (req, res) => {
  res.send('Rota de Artigos');
});

router.get('/admin/articles/new', (req, res) => {
  res.send('Rota para Criar uma nova artigo');
});

module.exports = router;
