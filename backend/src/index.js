const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
require('dotenv').config()

const app = express();
// cors
const cors = require('cors');
var corsOptions = {
  origin: '*', // Reemplazar con dominio
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// importando a Base de datos
require ('./database');

// import routes
const authRoutes = require('./routes/auth')
const dashboadRoutes = require('./routes/dashboard');

//importing verify token fuction
const verifyToken = require('./libs/validate-token');

// route middlewares
app.use('/user', authRoutes)
app.use('/', verifyToken, dashboadRoutes);

const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(__dirname + "/public"));

// iniciar server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`servidor andando en: ${PORT}`)
})