const express = require("express");
const bodyParser = require('body-parser');
const expressSession = require("express-session");
const flash = require('express-flash');
const bcrypt = require("bcryptjs");
const axios = require('axios');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// MIDDLEWARES
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(bodyParser.json());
app.use(expressSession({
  secret:"secret",
  resave:true,
  saveUninitialized:true
}));
app.use("/resourses", express.static("src"));
app.use("/resourses", express.static(__dirname + "/src"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// VARIABLES
const API_URL = process.env.API_URL;
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
let authToken;

// ROUTES
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/test', (req, res) => {
  res.render('test');
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
app.get("/consult", (reg, res) => {
  if (authToken) {
    res.render('consult');
  } else {
    res.redirect('/login');
  }
});
app.get('/checkRegister', (req, res) => {
  if (authToken) {
    res.render('checkRegister');
  } else {
    res.redirect('/login');
  }
});

// ENDPOINTS
app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, checkAuth } = req.body;

    const newUser = {
      nombre: firstName,
      apellidos: lastName,
      correo: email,
      contrasena: password,
      auth: checkAuth
    };

    console.log(newUser);
    const response = await axios.post(`http://localhost:8080/auth/register`, newUser);

    if (response.status === 200) {
      res.render('check', { message: 'Registraste de forma correcta, puedes volver a pagina de inicio' });
    } else {
      res.render('check', { message: 'Oops! Algo ha sido mal, intentalo de nuevo' });
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        console.log('Error interno del servidor: '+error.message);
        res.render('check', { message: 'Oops! Algo ha sido mal en el servidor, intentalo de nuevo' });
      } else if (error.response.status === 400) {
        console.log('Error interno del cliente: '+error.message);
        res.render('check', { message: 'Oops! Algo ha sido mal en el cliente, intentalo de nuevo' });
      } else {
        console.log('Error inesperado: '+error.message);
        res.render('check', { message: 'Oops! Algo ha sido mal, intentalo de nuevo' });  
      }
    } else {
      console.log('Error inesperado: '+error.message);
      res.render('check', { message: 'Oops! Algo ha sido mal, intentalo de nuevo' });
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
        console.log('Error interno del servidor: '+error.message);
        res.render('check', { message: 'Oops! Algo ha sido mal en el servidor, intentalo de nuevo mas tarde!' });
      } else if (error.response.status === 400) {
        console.log('Error interno del cliente: '+error.message);
        res.render('check', { message: 'Oops! Algo ha sido mal en el cliente, intentalo de nuevo mas tarde!' });
      } else {
        console.log('Error inesperado: '+error.message);
        res.render('check', { message: 'Oops! Algo ha sido mal, intentalo de nuevo mas tarde!' });  
      }
    } else {
      console.log('Error inesperado: '+error.message);
      res.render('check', { message: 'Oops! Algo ha sido mal, intentalo de nuevo mas tarde!' });
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
    if (response.status === 200) {
      res.redirect('/user');
    } else {
      res.status(500).send('Error al crear el usuario');
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
      res.redirect('/user');
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
      res.redirect('/user');
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

app.post('/getUserRegister', async (req, res) => {
  try {
    if (!authToken) {
      return res.status(401).send('No autorizado. Por favor, autentícate primero.');
    }

    // Llamar a la API de SpringBoot para obtener los usuarios con estado false
    const response = await axios.get(`${API_URL}/pendientes`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    const userData = response.data;

    // Verificar si se encontraron datos de usuarios con estado false
    if (userData) {
      // Enviar los datos de usuarios como respuesta en formato JSON
      res.status(200).json(userData);
    } else {
      // Si no se encontraron usuarios, enviar un mensaje de error
      res.status(404).send('Usuarios no encontrados');
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        res.status(500).send('Error interno del servidor: ' + error.message);
      } else {
        res.status(400).send('Error interno del cliente: ' + error.message);
      }
    } else {
      res.send('Error inesperado: ' + error.message);
    }
  }
});

app.post('/checkRegister', async (req, res) => {
  try {
    const { email } = req.body;

    // Llamar a la API de SpringBoot para aprobar el usuario
    const response = await axios.put(`${API_URL}/aprobar/${email}?estado=true`, null, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });

    // Verificar si se aprobó correctamente
    if (response.status === 200) {
        res.status(200).send('Usuario aprobado exitosamente');
    } else {
        res.status(500).send('Error al aprobar el usuario');
    }
} catch (error) {
    if (error.response) {
        if (error.response.status === 500) {
            res.status(500).send('Error interno del servidor: ' + error.message);
        } else {
            res.status(400).send('Error interno del cliente: ' + error.message);
        }
    } else {
        res.status(500).send('Error inesperado: ' + error.message);
    }
}
});

// START SERVER
app.listen(PORT, (reg, res) => {
  console.log("Server host is http://localhost:"+PORT + "/login");
  console.log("API URL is " + API_URL);
})