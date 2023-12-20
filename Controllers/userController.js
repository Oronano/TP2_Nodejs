const Users = require('../Models/users');
const Role = require('../Models/roles');
const Gods = require('../Models/gods');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createTableUser = async (req, res) => {
    try {
        await Users.sync({ force: true });
        res.status(200).json({ message: 'Table créée' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur' });
    }
}

/* exports.addUser = async (req, res) => {
    console.log(req.body)
    let newUser = req.body;
    try {
        const plusUser = await Users.create({ prenom: newUser.nom})
        res.status(200).json({ "Nom_Ajouter" : + plusUser.nom})
    }
    catch (err) {
        res.status(500).json({ error: 'Erreur' })
        console.log(err)
    }
} */

/* exports.Register = async(req, res) => {
    const { prenom, password } = req.body;
    console.log(prenom, password);
    let conn = await pool.getConnection();
    let result = await conn.query('SELECT * from users WHERE prenom = ?', [prenom]);
    console.log(result)
    // conn.release();
    if(result.length > 0){
        return res.status(400).send({
            message: 'prénom existe déjà'
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = 'INSERT INTO utilisateur (prenom, password) VALUES (?, ?)';
    const insertUserValues = [prenom, hashedPassword];
    await conn.query(insertUserQuery, insertUserValues);
    conn.release();

    const token = jwt.sign({ prenom: prenom }, process.env.API_KEY);
    res.json({ token });
} */

// Function qui ajoute un utilisateur dans la bdd et lui donne le role de peon par default
exports.Register = async(req, res) => {
    const { prenom, password } = req.body;
    console.log(prenom, password);

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await Users.findOne({
        where: {
            prenom: prenom
        }
    });
    console.log(existingUser)

    // Si l'utilisateur existe déjà, on renvoie une erreur
    if (existingUser) {
        return res.status(400).send({
            message: 'prénom existe déjà',
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insére l'utilisateur dans la base de données
    newUser = await Users.create({
        prenom: prenom,
        password: hashedPassword
    });

    const roleUser = await Role.findOne({
        where: {
            titre: 'peon'
        }
    });
    if (roleUser) {
        await newUser.addRole(roleUser);
    }

    // Génération du token
    const token = jwt.sign({ prenom: prenom }, process.env.API_KEY);
    res.json({ token });
}

// Function qui permet de se connecter

exports.Login = async(req, res) => {
    const { prenom, password } = req.body;
    const theOne = await Users.findOne({
        where: {
            prenom: prenom
        }
    });
    // console.log(theOne);

    // Si l'utilisateur existe compare le mot de passe
    if (theOne) {
        const passwordMatch = await bcrypt.compare(password, theOne.password);

        // Si le mot de passe ne correspond pas, on renvoie une erreur
        if (!passwordMatch) {
            return res.status(401).send({
                erreur: 'password invalide'
            })
        }
        //token
        const token = jwt.sign({ prenom: prenom }, process.env.API_KEY,  { expiresIn: '24h' });
        res.json({ token });
    } 
    else {
        return res.status(401).send({
            erreur: 'Pas d\'utilisateur avec ce prénom'
        })
    }

}

// Function qui permet de supprimer un utilisateur
exports.deleteUser = async(req, res) => {
    const { prenom } = req.body;
    const user = await Users.findOne({
        where: {
            prenom: prenom
        }
    });
    console.log(user)
    if (user) {
        await user.destroy();
        res.json({ message: 'Utilisateur supprimé' });
    } else {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
}

// Function qui ajoute un rôle à un utilisateur
exports.addRoleUser = async (req, res) => {
    const { updUser, updRole, updGods } = req.body;

    try {
        // Trouve l'id de l'utilisateur
        const user = await Users.findOne({
            where: {
                prenom: updUser
            }
        });

        // trouve l'id du role
        const role = await Role.findOne({
            where: {
                titre: updRole
            }
        });

        // trouve l'id du god
        const god = await Gods.findOne({
            where: {
                nom: updGods
            }
        });

        
        // Check si l'utilisateur et le role existe
        if (!user || !role || !god) {
            return res.status(404).json({ error: 'Utilisateur ou rôle non trouvé' });
        }

        // Ajoute le role à l'utilisateur
        await user.addRole(role);


        // Associé les dieux au role
        await role.addGods(god);

        res.json({ message: 'Rôle et dieux ajoutés à l\'utilisateur' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de l\'ajout du rôle et des dieux à l\'utilisateur' });
    }
}


// Function qui supprime un rôle précis de l'utilisateur
exports.deleteRoleUser = async (req, res) => {
    const { getUser, delRole } = req.body;

    try {
        // récupére l'utilisateur
        const user = await Users.findOne({
            where: {
                prenom: getUser
            }
        });

        // récupére le role
        const role = await Role.findOne({
            where: {
                titre: delRole
            }
        });

        // Check if the user and role exist
        if (!user || !role) {
            return res.status(404).json({ error: 'Utilisateur ou rôle non trouvé' });
        }

        // Remove the role from the user
        await user.removeRole(role);

        res.json({ message: 'Rôle supprimé de l\'utilisateur' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du rôle de l\'utilisateur' });
    }
}

exports.GetUsersfromGods = async (req, res) => {
    try {
        const godsForAdmin = await Users.findAll({
            include: {
                model: Gods,
                through: 'role_gods'
            }
        });
        res.status(200).json(godsForAdmin);
    } catch (err) {
        res.status(500).json({ error: 'Erreur' });
        console.error(err);
    }
}