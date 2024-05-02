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
      `;
      break;
  }

  // Actualizar el contenido de <main>
  mainContent.innerHTML = content;
}