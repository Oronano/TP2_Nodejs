const gods = require('../Models/gods');
const checkRole = require('../Middlewares/middleware');

exports.createTableGods = async (req, res) => {
    try {
        await gods.sync({ force: true });
        res.status(200).json({ message: 'Table créée' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur' });
    }
}

exports.addGods = async (req, res) => {
    try {
        const newGod = req.body;
        const addedGod = await gods.create({ nom: newGod.nom, description: newGod.description });
        res.status(200).json({ "Id": addedGod.id, "Nom_Ajouter": addedGod.nom });
    } catch (err) {
        res.status(500).json({ error: 'Erreur' });
        console.error(err);
    }
};




// Vérifie le role pour afficher les dieux
/* exports.checkRole(['admin']), async (req, res) => {
    try {
        const godsForAdmin = await gods.findAll({
            where: { role: 'admin' },
            attributes: ['nom', 'description']
        });
        res.status(200).json(godsForAdmin);
    } catch (err) {
        res.status(500).json({ error: 'Erreur' });
        console.error(err);
    }
};

// Vérifie le role pour afficher les dieux
exports.checkRole(['peon']), async (req, res) => {
    try {
        const godsForPeon = await gods.findAll({
            where: { role: 'peon' },
            attributes: ['nom', 'description']
        });
        res.status(200).json(godsForPeon);
    } catch (err) {
        res.status(500).json({ error: 'Erreur' });
        console.error(err);
    }
}; */