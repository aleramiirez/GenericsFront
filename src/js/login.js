const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

function loader() {
  // Crear elementos
const maskDiv = document.createElement('div');
maskDiv.className = 'mask';
const loaderDiv = document.createElement('div');
loaderDiv.className = 'loader';
const pElement = document.createElement('p');
pElement.textContent = 'Registraste correctamente.';
const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svgElement.setAttribute('viewBox', '25 25 50 50');
const circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
circleElement.setAttribute('r', '20');
circleElement.setAttribute('cy', '50');
circleElement.setAttribute('cx', '50');

// Construir la estructura
svgElement.appendChild(circleElement);
loaderDiv.appendChild(pElement);
loaderDiv.appendChild(svgElement);
maskDiv.appendChild(loaderDiv);

// Añadir al documento
document.body.appendChild(maskDiv);

// Eliminar la máscara después de 5 segundos
setTimeout(() => {
  maskDiv.classList.add('hide');
  setTimeout(() => {
    maskDiv.remove();
  }, 600);
}, 3000);
}