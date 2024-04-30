const bcrypt = require("bcryptjs");
const axios = require('axios');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
<<<<<<< HEAD
const ejs = require('ejs');
 
=======

>>>>>>> feature-dilior
// invocamos a express
const express = require("express");
const flash = require('express-flash');
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

const API_URL=process.env.API_URL;
const PORT=process.env.PORT;
const JWT_SECRET=process.env.JWT_SECRET;
let authToken;

// establacer las rutas
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/home', (req, res) => {
  if (authToken) {
    res.render('home');
  } else {
    res.redirect('/login');
  }
});
app.get('/user', (req, res) => {
  if (authToken) {
    res.render('user');
  } else {
    res.redirect('/login');
  }
});
app.get("/create", (reg, res) => {
  if (authToken) {
    res.render('create');
  } else {
    res.redirect('/login');
  }
});
app.get("/edite", (reg, res) => {
  if (authToken) {
    res.render('edite');
  } else {
    res.redirect('/login');
  }
});
app.get("/consult", (reg, res) => {
  if (authToken) {
    res.render('consult');
  } else {
    res.redirect('/login');
  }
});
app.get("/delete", (reg, res) => {
  if (authToken) {
    res.render('delete');
  } else {
    res.redirect('/login');
  }
});

// endpoints
app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const newUser = {
      nombre: firstName,
      apellidos: lastName,
      correo: email,
      contrasena: password
    };

    const response = await axios.post(`http://localhost:8080/auth/register`, newUser);

    if (response.status === 200) {
      res.render('login');
    } else {
      res.render('login');
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        res.status(500).send('Error interno del servidor: '+error.message);
      } else {
        res.status(400).send('Error interno del cliente: '+error.message);
      }
    } else {
      res.send('Error inesperado: '+error.message);
    }  
  }
});

app.post('/auth', async (req, res) => {
  try {
    const { email, password } = req.body;
    authToken = await loginWithJwt(email, password);
    if (authToken) {
      res.redirect('/home');
    } else {
      throw new Error('Token JWT no recibido');
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        res.status(500).send('Error interno del servidor: '+error.message);
      } else {
        res.status(400).send('Error interno del cliente: '+error.message);
      }
    } else {
      res.send('Error inesperado: '+error.message);
    }
  }
});

async function loginWithJwt(correo, contrasena) {
  try {
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
      return authToken;
    } else {
      throw new Error('Failed to login with JWT');
    }
  } catch (error) {
    throw error;
  }
}

<<<<<<< HEAD
//Crear un usuario nuevo
=======

>>>>>>> feature-dilior
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
      res.render('create', { successMessage: 'Usuario creado' });
      
    } else {
      res.render('create', { errorMessage: 'Error al crear el usuario' });
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        res.status(500).send('Error interno del servidor: '+error.message);
      } else {
        res.status(400).send('Error interno del cliente: '+error.message);
      }
    } else {
      res.send('Error inesperado: '+error.message);
    }  
  }
});

<<<<<<< HEAD
 
// Modificar un usuario
=======
>>>>>>> feature-dilior
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
    if (error.response) {
      if (error.response.status === 500) {
        res.status(500).send('Error interno del servidor: '+error.message);
      } else {
        res.status(400).send('Error interno del cliente: '+error.message);
      }
    } else {
      res.send('Error inesperado: '+error.message);
    }  
  }
});

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
    if (error.response) {
      if (error.response.status === 500) {
        res.status(500).send('Error interno del servidor: '+error.message);
      } else {
        res.status(400).send('Error interno del cliente: '+error.message);
      }
    } else {
      res.send('Error inesperado: '+error.message);
    }  
  }
});

app.post('/getUser', async (req, res) => {
  try {
    const { searchBy, searchTerm } = req.body;

    if (!authToken) {
      return res.status(401).send('No autorizado. Por favor, autentícate primero.');
    }

    // Llamar a la API de SpringBoot para buscar el usuario según el campo y el término de búsqueda
    const response = await axios.get(`${API_URL}/${searchBy}/${searchTerm}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    const userData = response.data; // Acceder directamente a response.data 

    // Verificar si se encontraron datos del usuario
    if (userData) {
      // Enviar los datos del usuario como respuesta en formato JSON
      res.status(200).json(userData);
    } else {
      // Si no se encontró el usuario, enviar un mensaje de error
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        res.status(500).send('Error interno del servidor: '+error.message);
      } else {
        res.status(400).send('Error interno del cliente: '+error.message);
      }
    } else {
      res.send('Error inesperado: '+error.message);
    }  
  }
});

<<<<<<< HEAD

=======
>>>>>>> feature-dilior
// Start server
app.listen(PORT, (reg, res) => {
  console.log("Server host is http://localhost:"+PORT + "/login");
  console.log("API URL is " + API_URL);
})