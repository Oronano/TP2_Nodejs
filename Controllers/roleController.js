const role = require('../Models/roles');

exports.createTableRoles = async (req, res) => {
    try {
        await role.sync({ force: true });
        res.status(200).json({ message: 'Table créée' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur' });
    }
}