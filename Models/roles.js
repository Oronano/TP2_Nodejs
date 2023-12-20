const { DataTypes } = require('sequelize');
const sequelize = require('../Database/dbSequelize');

const Gods = require('../Models/gods');
const User = require('../Models/users');

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titre: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    freezeTableName: true
});


// Role - Gods
Role.belongsToMany(Gods, {
    through: 'role_gods', 
    foreignKey: 'role_id'
});
Gods.belongsToMany(Role, {
    through: 'role_gods',
    foreignKey: 'gods_id'
});


// Role - User
Role.belongsToMany(User, {
    through: 'role_user',
    foreignKey: 'role_id'
});
User.belongsToMany(Role, {
    through: 'role_user',
    foreignKey: 'user_id'
});


module.exports = Role;