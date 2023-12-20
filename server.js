const cors = require('cors');
const express = require('express');
const app = express();
app.use(express.json());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersRoute = require('./Routes/usersRoute.js');
const godsRoute = require('./Routes/godsRoute.js');
const rolesRoute = require('./Routes/rolesRoute.js');



// Met à jour la BDD
/* const sequelize = require('./Database/dbSequelize');
let maj = async(req,res)=>{
    await sequelize.sync({force: true});
    console.log('maj effectuée');
}
maj(); */


app.use(cors());

app.use('/users', usersRoute);
app.use('/gods', godsRoute);
app.use('/role', rolesRoute);

app.listen(3000, () => {
    console.log('Le serveur écoute sur le port 3000');
});