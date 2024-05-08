let currentPage = page;

function showContent(page) {
  var mainContent = document.getElementById("formContent");
  var content = "";

  // Dependiendo de la opción seleccionada, cargar el contenido apropiado
  switch (page) {
    case 'create':
      content = `
      <form class="form" id="createUserForm" action="/createUser" method="post">
        <h1>Crear Usuario</h1>
          <div class="input-form">
            <div class="form-group">
              <label for="firstName">Nombre</label>
              <input name="firstName" id="firstName" type="text" required>
            </div>
          <div class="form-group">
            <label for="lastName">Apellidos</label>
            <input name="lastName" id="lastName" type="text" required>
          </div>
          <div class="form-group">
            <label for="age">Edad</label>
            <input name="age" id="age" type="number" required>
          </div>
          <div class="form-group">
            <label for="email">Correo</label>
            <input name="email" id="email" type="email" required>
          </div>
          <div class="form-group">
            <label for="address">Direccion</label>
            <input name="address" id="address" type="text" required>
          </div>
          <div class="form-group">
            <label for="mobile">Telefono</label>
            <input name="mobile" id="mobile" type="number" required>
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input name="password" id="password" type="password" required>
          </div>
        </div>
        <button type="submit" class="form-submit-btn">Crear</button>
      </form>
      `;
      break;

    case 'edit':
      content = `
        <form class="form" id="editUserForm" action="/editUser" method="post">
          <h1>Editar Usuario</h1>
          <div class="input-form">
            <div class="form-group">
              <label for="email">Correo del usuario a editar</label>
              <input name="email" id="email" type="email" required>
            </div>
            <div class="form-group">
              <label for="firstName">Nombre</label>
              <input name="firstName" id="firstName" type="text" required>
            </div>
            <div class="form-group">
              <label for="lastName">Apellidos</label>
              <input name="lastName" id="lastName" type="text" required>
            </div>
            <div class="form-group">
              <label for="age">Edad</label>
              <input name="age" id="age" type="number" required>
            </div>
            <div class="form-group">
              <label for="address">Direccion</label>
              <input name="address" id="address" type="text" required>
            </div>
            <div class="form-group">
              <label for="mobile">Telefono</label>
              <input name="mobile" id="mobile" type="number" required>
            </div>
          </div>
          <button type="submit" class="form-submit-btn">Editar</button>
        </form>
        `;
      break;

    case 'delete':
      content = `
        <form class="form" id="deleteUserForm" action="/deleteUser" method="post">
          <h1>Eliminar Usuario</h1>
          <div class="input-form form2">
              <div class="form-group">
                <label for="email">Correo</label>
                <input name="email" id="email" type="email" required>
              </div>
          </div>
          <button type="submit" class="form-submit-btn">Eliminar</button>
        </form>
        `;
      break;
      
    case 'consult':
      content = `
      <form class="form" id="searchForm" action="/getUser" method="post">
        <h1>Buscar Usuario</h1>
        <div class="input-form">
          <div class="form-group">
            <label for="searchBy">Buscar por:</label>
              <select name="searchBy" id="searchBy" required>
                <option value="nombre">Nombre</option>
                <option value="apellidos">Apellidos</option>
                <option value="edad">edad</option>
                <option value="correo">Correo</option>
                <option value="direccion">Direccion</option>
                <option value="telefono">Telefono</option>
              </select>
            </div>
            <div class="form-group">
              <label for="searchTerm">Término de búsqueda:</label>
              <input name="searchTerm" id="searchTerm" type="text" required>
            </div>
          </div>
          <button type="submit" class="form-submit-btn">Buscar</button>
        </div>
      </form>
      `;
      break;

    case 'prove':
      content = `
        <h1>Aprobar Usuario</h1>
      `;
      break;
  }
  // Actualizar el contenido de <main>
  mainContent.innerHTML = content;

  // Agregar evento de escucha para el envío del formulario
  if (page === 'create') {
    document.getElementById('createUserForm').addEventListener('submit', async (event) => {
      event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada
  
      const formData = new FormData(event.target); // Obtener datos del formulario
  
      try {
        const response = await fetch('/createUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(Object.fromEntries(formData)) // Convertir FormData a objeto JSON y enviar al servidor
        });
  
        if (!response.ok) {
          showToast('createError');
        } else {
          showToast('createSuccess');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('createError');
      }
    });
  }
  
  if (page === 'delete') {
    document.getElementById('deleteUserForm').addEventListener('submit', async (event) => {
      event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada
  
      const formData = new FormData(event.target); // Obtener datos del formulario
  
      try {
        const response = await fetch('/deleteUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(Object.fromEntries(formData)) // Convertir FormData a objeto JSON y enviar al servidor
        });
  
        if (!response.ok) {
          showToast('deleteError');
        } else {
          showToast('deleteSuccess');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('deleteError');
      }
    });
  }
  
  if (page === 'edit') {
    document.getElementById('editUserForm').addEventListener('submit', async (event) => {
      event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada
  
      const formData = new FormData(event.target); // Obtener datos del formulario
  
      try {
        const response = await fetch('/editUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(Object.fromEntries(formData)) // Convertir FormData a objeto JSON y enviar al servidor
        });
  
        if (!response.ok) {
          showToast('editError');
        } else {
          showToast('editSuccess');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('editError');
      }
    });
  }


  // Agregar el evento submit al formulario de búsqueda
  if (page === 'consult') {
    document.getElementById('searchForm').addEventListener('submit', async (event) => {
      event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

      const formData = new FormData(event.target); // Obtener datos del formulario
      const searchBy = formData.get('searchBy'); // Obtener el campo de búsqueda seleccionado
      const searchTerm = formData.get('searchTerm'); // Obtener el término de búsqueda

      try {
        const response = await fetch('/getUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ searchBy, searchTerm }) // Enviar el campo y el término de búsqueda al servidor
        });

        if (!response.ok) {
          showToast('consultInvalid');
        } else {
          showToast('consultSuccess');
        }

        const userDataArray = await response.json(); // Convertir la respuesta a JSON (un array de usuarios)

        if (userDataArray.length > 0) {
          // Si se encontraron usuarios, crear las tarjetas dinámicamente y agregarlas al contenedor
          const dataContainer = document.querySelector('.card-container'); // Contenedor de las tarjetas

          // Limpiar cualquier tarjeta existente antes de agregar nuevas
          dataContainer.innerHTML = '';

          // Crear tarjetas para cada usuario
          userDataArray.forEach(userData => {
            const card = document.createElement('div');
            card.classList.add('card');

            // Contenido de la tarjeta para cada usuario
            card.innerHTML = `
              <div class="icon">
                <i class="fas fa-user"></i>
              </div>
              <div class="data">
                <p id="name">${userData.nombre} ${userData.apellidos}</p>
                <p class="heading" id="correo">${userData.correo}</p>
                <p class="heading" id="age">${userData.edad} años</p>
                <p class="heading" id="address">${userData.direccion}</p>
                <p class="heading" id="mobile">${userData.telefono}</p>
              </div>
            `;

            // Agregar la tarjeta al contenedor
            dataContainer.appendChild(card);
          });
        } else {
          // Si no se encontraron usuarios, mostrar un mensaje de error
          showToast('consultInvalid');
          const dataContainer = document.querySelector('.card-container');
          dataContainer.innerHTML = '';
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  } else {
    // Si no estás en la página de consulta, limpiar el contenedor de tarjetas
    const dataContainer = document.querySelector('.card-container');
    dataContainer.innerHTML = '';
  }

  
  if (page === 'prove') {
    (async () => { // Utilizando una función asincrónica autoinvocada
      try {
        const response = await fetch('/getUserRegister', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error('Error al obtener los datos del usuario');
        }
  
        const userDataArray = await response.json();
  
        if (userDataArray.length > 0) {
          const dataContainer = document.querySelector('.card-container');
          dataContainer.innerHTML = '';
  
          userDataArray.forEach(userData => {
            const card = document.createElement('div');
            card.classList.add('card');
  
            card.innerHTML = `
              <div class="icon">
                <i class="fas fa-user"></i>
              </div>
              <div class="data">
                <p id="name" class="heading">${userData.nombre} ${userData.apellidos}</p>
                <p class="heading" id="correo">${userData.correo}</p>             
              </div>
              <div class="buttons">
                <button type="button" id="true" class="btn btn-info btn-circle btn-lg"><i class="fas fa-check"></i></button>
                <button type="button" id="false" class="btn btn-warning btn-circle btn-lg"><i class="fas fa-times"></i></button>
              </div>
            `;
  
            dataContainer.appendChild(card);
            // Agregar evento de clic al botón con id "true"
            const approveButton = card.querySelector('#true');
            approveButton.addEventListener('click', () => {
              // Llamar a la función para aprobar el usuario
              checkRegister(userData.correo);
            });
            // Agregar evento de clic al botón con id "false"
            const deleteButton = card.querySelector('#false');
            deleteButton.addEventListener('click', () => {
              // Llamar a la función para eliminar el usuario
              deleteUser(userData.correo);
            });
          });
        } else {
          showToast('verificyInvalid');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    })();

    // Función para aprobar un usuario
    async function checkRegister(email) {
      try {
        const response = await fetch('/checkRegister', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email }) // Pasar el correo del usuario a aprobar
        });

        if (!response.ok) {
          showToast('verificyError');
        } else {
          showToast('verificySuccess');
          setTimeout(() => {
            location.reload();
          }, 6000);
        }
      } catch (error) {
        console.error('Error al aprobar el usuario:', error);
        showToast('verificyError');
      }
    }
    // Función para eliminar un usuario
    async function deleteUser(email) {
        try {
          const response = await fetch('/deleteUser', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email: email }) // Pasar el correo del usuario a eliminar
          });

          if (!response.ok) {
            showToast('declineError');
          } else {
            showToast('declineSuccess');
            setTimeout(() => {
              location.reload();
            }, 6000);
          }
        } catch (error) {
          console.error('Error al eliminar el usuario:', error);
          showToast('declineError');
        }
    }
  } else {
    // Si no estás en la página de consulta, limpiar el contenedor de tarjetas
    const dataContainer = document.querySelector('.card-container');
    dataContainer.innerHTML = '';
  }
}

function showToast(message) {
  let toastBox = document.getElementById('toastBox');
  let toast = document.createElement('div');
  toast.classList.add('toast');
  let content = "";

  switch (message) {
    case 'verificySuccess':
      toast.classList.add('success');
      content = '<i class="fa-solid fa-circle-check"></i> El usuario fue verificado corectamente';
      break;
    case 'verificyError':
      toast.classList.add('error');
      content = '<i class="fa-solid fa-circle-xmark"></i> Error al verificar usuario';
      break;

    case 'declineSuccess':
      toast.classList.add('success');
      content = '<i class="fa-solid fa-circle-check"></i> El usuario fue rechazado corectamente';
      break;
    case 'declineError':
      toast.classList.add('error');
      content = '<i class="fa-solid fa-circle-xmark"></i> Error al rechazar usuario';
      break;
    case 'verificyInvalid':
      toast.classList.add('invalid');
      content = '<i class="fa-solid fa-circle-exclamation"></i> No hay ningun usuario pendiente en verificar';
      break;

    case 'createSuccess':
      toast.classList.add('success');
      content = '<i class="fa-solid fa-circle-check"></i> El usuario fue creado correctamente';
      break;
    case 'createError':
      toast.classList.add('error');
      content = '<i class="fa-solid fa-circle-xmark"></i> Ha ocurrido un error al crear el usuario';
      break;

    case 'editSuccess':
      toast.classList.add('success');
      content = '<i class="fa-solid fa-circle-check"></i> Los datos fueron guardados correctamente';
      break;
    case 'editError':
      toast.classList.add('error');
      content = '<i class="fa-solid fa-circle-xmark"></i> Ha ocurrido un error al modificar los datos';
      break;

    case 'deleteSuccess':
      toast.classList.add('success');
      content = '<i class="fa-solid fa-circle-check"></i> El usuario fue eliminado corectamente';
      break;
    case 'deleteError':
      toast.classList.add('error');
      content = '<i class="fa-solid fa-circle-xmark"></i> Error al eliminar usuario';
      break;

    case 'consultSuccess':
      toast.classList.add('success');
      content = '<i class="fa-solid fa-circle-check"></i> Los usuarios segun tu busqueda:';
      break;
    case 'consultInvalid':
      toast.classList.add('invalid');
      content = '<i class="fa-solid fa-circle-exclamation"></i> No ha encontrado ningun usuario';
      break;
    
    case 'invalid':
      toast.classList.add('invalid');
      content = '<i class="fa-solid fa-circle-exclamation"></i></i> Entrada de datos no válida';
      break;
  }

  toast.innerHTML = content;
  toastBox.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 6000);

  document.addEventListener('click', function(event) {
    if (!toast.contains(event.target)) {
      toast.remove();
    }
  });
}