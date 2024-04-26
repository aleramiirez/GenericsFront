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

//Crear un usuario nuevo
app.post('/createUser', async (req, res) => {
  try {
    // Obtener los datos del formulario desde el cuerpo de la solicitud
    const { firstName, lastName, age, email, address, mobile, password } = req.body;

    // Crear un objeto con los datos del nuevo usuario
    const newUser = {
      nombre: firstName,
      apellidos: lastName,
      edad: age,
      correo: email,
      direccion: address,
      telefono: mobile,
      contrasena: password
    };

    // Llamar a la API de SpringBoot para crear el usuario
    const response = await axios.post(`${API_URL}/crear`, newUser);

    // Verificar si se creó correctamente
    if (response.status === 201) {
      res.redirect('/create');
    } else {
      res.status(500).send('Error al crear el usuario');
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    
    if (error.response) {
      if (error.response.status === 500) {
        res.status(500).send('Error interno del servidor');
      } else {
        res.status(500).send('Error inesperado');
      }
    } else {
      res.status(500).send('Error inesperado');
    }
  }
});

// Modificar un usuario
app.post('/editUser', async (req, res) => {
  try {
    const email = req.body.email;
    
    // Obtener los datos del formulario desde el cuerpo de la solicitud
    const { firstName, lastName, age, address, mobile } = req.body;

    // Crear un objeto con los datos actualizados del usuario
    const updatedUser = {
      nombre: firstName,
      apellidos: lastName,
      edad: age,
      direccion: address,
      telefono: mobile,
    };

    // Llamar a la API de SpringBoot para editar el usuario
    const response = await axios.put(`${API_URL}/editar/${email}`, updatedUser);

    // Verificar si se editó correctamente
    if (response.status === 200) {
      res.redirect('/edite');
    } else {
      res.status(500).send('Error al editar el usuario');
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    
    if (error.response) {
      if (error.response.status === 500) {
        res.status(500).send('Error interno del servidor');
      } else {
        res.status(500).send('Error inesperado');
      }
    } else {
      res.status(500).send('Error inesperado');
    }
  }
});


// Eliminar usuario por correo
app.post('/deleteUser', async (req, res) => {
  try {
    const email = req.body.email;

    // Llamar a la API de SpringBoot para eliminar el usuario
    const response = await axios.delete(`${API_URL}/borrar/${email}`);

    // Verificar si se eliminó correctamente
    if (response.status === 200) {
      res.redirect('/delete');
    } else {
      res.status(500).send('Error al eliminar el usuario');
    }
    
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    
    if (error.response) {
      if (error.response.status === 404) {
        res.status(404).send('Usuario no encontrado');
      } else if (error.response.status === 500) {
        res.status(500).send('Error interno del servidor');
      } else {
        res.status(500).send('Error inesperado');
      }
    } else {
      res.status(500).send('Error inesperado');
    }
  }
});


// Start server
app.listen(PORT, (reg, res) => {
  console.log("Server host is http://localhost:"+PORT + "/index");
  console.log("API URL is " + API_URL);
})
