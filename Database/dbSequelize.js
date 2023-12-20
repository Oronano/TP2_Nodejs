const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_DTB, process.env.DB_USER, process.env.DB_PWD, {
    host: process.env.DB_HOST,
    dialect: 'mariadb'
})

sequelize.authenticate().then(() => {
    console.log('Connection successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
}); 

module.exports = sequelize;