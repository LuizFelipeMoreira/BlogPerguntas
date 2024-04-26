const Sequelize = require('sequelize');

const connection = new Sequelize('guiapress', 'root', 'inclo1254', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = connection;
