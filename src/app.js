const bcrypt = require("bcryptjs");
const axios = require('axios');
const morgan = require('morgan');
const bodyParser = require('body-parser');

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

// const PORT = process.env.PORT;
// const API_URL = process.env.API_URL;
API_URL="http://localhost:8080/api/v1/usuarios"
PORT="3000"

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

// establacer las rutas
app.get('/login', (req, res) => {
  res.render('login');
});
app.get("/index", (reg, res) => {
  res.render("index", {msg: "Interfaz Aplicacion Web Gestion Generica"});
})
app.get("/create", (reg, res) => {
  res.render("create", {msg: "CREATE DILIOR GENIO"});
})
app.get("/edite", (reg, res) => {
  res.render("edite", {msg: "EDIT BOBO"});
})
app.get("/delete", (reg, res) => {
  res.render("delete", {msg: "DELETE ALE PIDORAS"});
})
app.get("/consult", (reg, res) => {
  res.render("consult", {msg: "CONSULT NADA NADA"});
})

app.post('/index', async (req, res) => {
  try {
    const { email } = req.body;
    const response = await axios.get(`${API_URL}/${email}`);

    const user = response.data;
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Mostrar la respuesta en la consola
    console.log('Respuesta GET:', response.data);

    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
      // Manejar el error de conexión aquí
      console.error('Error de conexión:', error);
      res.status(500).send('Error de conexión con el servidor');
    } else {
      // Otro tipo de error
      console.error('Error:', error);
      res.status(500).send('Error interno del servidor');
    }
  }
});

// Start server
app.listen(PORT, (reg, res) => {
  console.log("Server host is http://localhost:"+PORT);
  console.log("API URL is " + API_URL);
})
