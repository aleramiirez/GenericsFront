function showContent(page) {
  var mainContent = document.getElementById("mainContent");
  var content = "";

  // Dependiendo de la opción seleccionada, cargar el contenido apropiado
  switch (page) {
    case 'create':
      content = `
        <div class="cont">
          <h1>Crear Usuario</h1>
          <form class="form" action="/createUser" method="post">
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
            <div class="form-group">
              <label for="searchBy">Autoidentificación</label>
              <select name="checkAuth" id="checkAuth" required>
                <option value="auth">Activado</option>
                <option value="NOauth">Desactivado</option>
              </select>
            </div>
            <button type="submit" class="form-submit-btn">Crear</button>
          </form>
        </div>
      `;
      break;

    case 'edit':
      content = `
        <div class="cont">
          <h1>Editar Usuario</h1>
          <form class="form" action="/editUser" method="post">
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
            <button type="submit" class="form-submit-btn">Editar</button>
          </form>
        </div>
        `;
      break;

    case 'delete':
      content = `
        <div class="cont">
          <h1>Eliminar Usuario</h1>
          <form class="form form2" action="/deleteUser" method="post">
            <div class="form-group">
              <label for="email">Correo</label>
              <input name="email" id="email" type="email" required>
            </div>
            <button type="submit" class="form-submit-btn">Eliminar</button>
          </form>
        </div>
        `;
      break;
      
    case 'consult':
      content = `
      <div class="cont">
          <h1>Buscar Usuario</h1>
          <form class="form" id="searchForm" action="/getUser" method="post">
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
            <button type="submit" class="form-submit-btn">Buscar</button>
          </form>
        </div>
      <div class="card-container">
        
      </div>
    </div>
      `;
      content += `<link href="resourses/css/index.css" rel="stylesheet" type="text/css"/>`;
      content += `<link href="resourses/css/consult.css" rel="stylesheet" type="text/css"/>`;
      break;
  }

  // Actualizar el contenido de <main>
  mainContent.innerHTML = content;

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
          throw new Error('Error al obtener los datos del usuario');
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
                <p class="heading" id="correo">${userData.correo}</p>
                <p class="heading" id="age">${userData.edad} años</p>
                <p class="heading" id="address">${userData.direccion}</p>
                <p class="heading" id="mobile">${userData.telefono}</p>
                <p id="name">${userData.nombre} ${userData.apellidos}</p>
              </div>
            `;

            // Agregar la tarjeta al contenedor
            dataContainer.appendChild(card);
          });
        } else {
          // Si no se encontraron usuarios, mostrar un mensaje de error
          alert('Usuario no encontrado');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }
}