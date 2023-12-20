const { DataTypes } = require('sequelize');
const sequelize = require('../Database/dbSequelize');

const Gods = sequelize.define('Gods', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    freezeTableName: true
});


module.exports = Gods;
