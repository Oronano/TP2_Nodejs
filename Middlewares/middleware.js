const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const Users = require('../Models/users');
const Role = require('../Models/roles');
const Gods = require('../Models/gods');

// Check si l'utilisateur est connecté
exports.authenticator = (req, res, next) => {
    let token = req.query.token ? req.query.token : req.headers.authorization
    if (token && process.env.API_KEY) {
        jwt.verify(token, process.env.API_KEY, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Accès refuser' });
            }
            else {
                next();
            }
        });
    } else {
        res.status(401).json({ error: 'Pas de token' });
    }
}


exports.admin = async (req, res, next) => {
    let token = req.query.token ? req.query.token : req.headers.authorization;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.API_KEY);
            const { prenom } = decoded;

            // Récupére les infos de la bdd
            const user = await Users.findOne({
                where: {
                    prenom: prenom
                },
                include: {
                    model: Role,
                    through: 'role_user',
                    include: {
                        model: Gods,
                        through: 'role_gods'
                    }
                }
            });

            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé' });
            }

            // Check si l'utilisateur est un admin
            // console.log(user.Roles)
            for (const role of user.Roles) {
                console.log(role.titre)
                if (role.titre === 'admin') {
                    next();
                }/*  else {
                    res.status(401).json({ error: 'Accès interdit (non-admin)' });
                } */
            }
        } catch (error) {
            console.error(error);
            res.status(401).json({ error: 'Erreur lors de la vérification des privilèges' });
        }
    } else {
        res.status(401).json({ error: 'Pas de token' });
    }
};

// Fonction pour vérifié le role de l'utilisateur
/* const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user
        if (user && user.roles && allowedRoles.includes(user.roles)) {
            next();
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    };
};

module.exports = router; */


























// Check si l'utilisateur est admin
/* exports.admin = (req, res, next) => {
    let token = req.query.token ? req.query.token : req.headers.authorization;
    if (token && process.env.API_KEY) {
        jwt.verify(token, process.env.API_KEY, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Accès refusé' });
            } else {
                const { prenom } = decoded;
                console.log(prenom);

                // functionGetUser(getUser);
                if (prenom) {
                    next();
                } else {
                    res.status(403).json({ error: 'Accès interdit' });
                }
            }
        });
    } else {
        res.status(401).json({ error: 'Pas de token' });
    }
} */