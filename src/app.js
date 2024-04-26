const bcrypt = require("bcryptjs");
const axios = require('axios');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// invocamos a express
const express = require("express");
const app = express();

// seteamos urlencoded para capturar los datos del fomulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(bodyParser.json());

// inovacmos a dontv
const dotenv = require("dotenv");
dotenv.config();

// el directorxio public
app.use("/resourses", express.static("src"));
app.use("/resourses", express.static(__dirname + "/src"));

// establacemos el motor de plantillas ejs
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// var de sesion
const expressSession = require("express-session")
app.use(expressSession({
  secret:"secret",
  resave:true,
  saveUninitialized:true
}))

const API_URL="http://localhost:8080/api/v1/usuarios"
const PORT="3000"
const KEY="lMCvj7Sirkk41OpuXDBKoSA1YeQ4aTeHmP4gzoyoaLk="

// establacer las rutas
app.get('/login', (req, res) => {
  res.render('login');
});
app.get("/index", (reg, res) => {
  res.render("index");
})
app.get("/create", (reg, res) => {
  res.render("create");
})
app.get("/edite", (reg, res) => {
  res.render("edite");
})
app.get("/consult", (reg, res) => {
  res.render("consult");
})
app.get("/delete", (reg, res) => {
  res.render("delete");
})

app.post('/auth', async (req, res) => {
  const {email, password } = req.body;
  const user = {email: email, password: password};

  const accessToken = generateAccessToken(user);

  res.header("authorization", accessToken).json({
    message: "Todo bien",
    token: accessToken
  });
});

function generateAccessToken (user) {
  return jwt.sign(user, KEY);
}
function validateToken (req, res, next) {
  const accessToken = req.header["authorization"];
  if(!accessToken) res.send("Acceso limitado")

  jwt.verify(accessToken, KEY, (err, user) => {
    if(err) {
      res.send("Acceso limitado, o token incorrecto")
    } else {
      next();
    }
  });
}

// Start server
app.listen(PORT, (reg, res) => {
  console.log("Server host is http://localhost:"+PORT);
  console.log("API URL is " + API_URL);
})
