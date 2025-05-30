// Referencias a elementos del DOM
const turnoForm = document.getElementById('turnoForm');
const listaTurnos = document.getElementById('listaTurnos');
const mensaje = document.getElementById('mensaje');

let turnos = [];

// Función para actualizar la lista de turnos y totales
function actualizarLista() {
  listaTurnos.innerHTML = '';

  let totalGenerado = 0;

  turnos.forEach((turno, index) => {
    totalGenerado += turno.dinero;

    const li = document.createElement('li');
    li.textContent = `${turno.nombre} - ${turno.email} - ${turno.fecha} - $${turno.dinero.toFixed(2)}`;

    // Botón para borrar turno
    const btnBorrar = document.createElement('button');
    btnBorrar.textContent = 'X';
    btnBorrar.classList.add('borrar-turno');
    btnBorrar.addEventListener('click', () => {
      borrarTurno(index);
    });

    li.appendChild(btnBorrar);
    listaTurnos.appendChild(li);
  });

  // Mostrar totales debajo de la lista
  mostrarTotales(totalGenerado);
}

// Función para borrar turno
function borrarTurno(index) {
  turnos.splice(index, 1);
  actualizarLista();
  mostrarMensaje('Turno eliminado.');
}

// Función para mostrar mensaje temporal
function mostrarMensaje(texto) {
  mensaje.textContent = texto;
  setTimeout(() => {
    mensaje.textContent = '';
  }, 3000);
}

// Función para mostrar totales
function mostrarTotales(total) {
  // Si no existe el contenedor lo creo y agrego
  let contenedorTotales = document.getElementById('contenedor-totales');

  if (!contenedorTotales) {
    contenedorTotales = document.createElement('div');
    contenedorTotales.id = 'contenedor-totales';
    contenedorTotales.style.color = '#dfff00';
    contenedorTotales.style.fontWeight = '700';
    contenedorTotales.style.marginTop = '1rem';
    contenedorTotales.style.textAlign = 'center';

    // Agrego el contenedor debajo de la lista de turnos
    listaTurnos.parentElement.appendChild(contenedorTotales);
  }

  contenedorTotales.innerHTML = `
    <p id="total-generado">Total generado: $${total.toFixed(2)}</p>
    <p id="total-monedero">Total en monedero: $${total.toFixed(2)}</p>
  `;
}

// Evento submit del formulario
turnoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = turnoForm.nombre.value.trim();
  const email = turnoForm.email.value.trim();
  const fecha = turnoForm.fecha.value;

  // Dinero fijo porque no hay input para esto en el form
  const dinero = 1000;

  if (!nombre || !email || !fecha) {
    mostrarMensaje('Completa todos los campos.');
    return;
  }

  const nuevoTurno = { nombre, email, fecha, dinero };
  turnos.push(nuevoTurno);

  actualizarLista();

  turnoForm.reset();

  mostrarMensaje('Turno agendado correctamente.');
});
