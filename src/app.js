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
 
// establacer las rutas
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/home', (req, res) => {
    //authToken = loginWithJwt();
  if (authToken) {
    res.render('home');
  } else {
    res.redirect('/login');
  }
});
app.get("/create", (reg, res) => {
  //authToken = loginWithJwt();
  if (authToken) {
    res.render('create');
  } else {
    res.redirect('/login');
  }
});
app.get("/edite", (reg, res) => {
  //authToken = loginWithJwt();
  if (authToken) {
    res.render('edite');
  } else {
    res.redirect('/login');
  }
});
app.get("/consult", (reg, res) => {
  //authToken = loginWithJwt();
  if (authToken) {
    res.render('consult');
  } else {
    res.redirect('/login');
  }
});
app.get("/delete", (reg, res) => {
  //authToken = loginWithJwt();
  if (authToken) {
    res.render('delete');
  } else {
    res.redirect('/login');
  }
});

const API_URL="http://localhost:8080/api/v1/usuarios"
const PORT="3000"
 
const JWT_SECRET="lMCvj7Sirkk41OpuXDBKoSA1YeQ4aTeHmP4gzoyoaLk="
let authToken;
 
// Endpoint para autenticar y obtener el token JWT
app.post('/register', async (req, res) => {
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
 
    const response = await axios.post(`http://localhost:8080/auth/register`, newUser);
 
    // Verificar si se creó correctamente
    if (response.status === 200) {
      authToken = await loginWithJwt(newUser.correo, newUser.contrasena);
      if (authToken) {
        res.redirect('/home');
      } else {
        throw new Error('Token JWT no recibido');
      }
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
 
app.post('/auth', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    authToken = await loginWithJwt(correo, contrasena);
    if (authToken) {
      res.redirect('/home');
    } else {
      throw new Error('Token JWT no recibido');
    }
  } catch (error) {
    console.error('Error al autenticar:', error.message,);
    res.status(500).send('Error al autenticar: ' + error.message);
  }
});
// Método para iniciar sesión con JWT
async function loginWithJwt(correo, contrasena) {
  try {
    console.log(correo, contrasena)
    const response = await axios.post("http://localhost:8080/auth/login", {
      correo: correo,
      contrasena: contrasena
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JWT_SECRET
      }
    });
 
    if (response.status === 200) {
      authToken = response.data.token;
      console.log(authToken)
      return authToken;
    } else {
      throw new Error('Failed to login with JWT');
    }
  } catch (error) {
    throw error;
  }
}
 
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
 
    if (!authToken) {
      return res.status(401).send('No autorizado. Por favor, autentícate primero.');
    }
 
    // Llamar a la API de SpringBoot para crear el usuario
    const response = await axios.post(`${API_URL}/crear`, newUser, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
 
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
 
    if (!authToken) {
      return res.status(401).send('No autorizado. Por favor, autentícate primero.');
    }
 
    // Llamar a la API de SpringBoot para editar el usuario
    const response = await axios.put(`${API_URL}/editar/${email}`, updatedUser, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
 
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
    if (!authToken) {
      return res.status(401).send('No autorizado. Por favor, autentícate primero.');
    }
 
    // Llamar a la API de SpringBoot para eliminar el usuario
    const response = await axios.delete(`${API_URL}/borrar/${email}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
 
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
 
// Consultar un usuario por su correo
app.post('/getUser', async (req, res) => {
  try {
    const email = req.body.email;
 
    if (!authToken) {
      return res.status(401).send('No autorizado. Por favor, autentícate primero.');
    }
 
    // Llamar a la API de SpringBoot para buscar el usuario por su correo electrónico
    const response = await axios.get(`${API_URL}/user/${email}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
 
    const userData = response.data;
 
    // Verificar si se encontraron datos del usuario
    if (userData) {
      res.send.json;
    } else {
      // Si no se encontró el usuario, enviar un mensaje de error
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    // Manejar cualquier error
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).send('Error interno del servidor');
  }
});
 
// Start server
app.listen(PORT, (reg, res) => {
  console.log("Server host is http://localhost:"+PORT + "/login");
  console.log("API URL is " + API_URL);
})