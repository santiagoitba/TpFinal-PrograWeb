const formulario = document.getElementById('turnoForm');
const lista = document.getElementById('lista-turnos');
const mensaje = document.getElementById('mensaje');
const totalGenerado = document.getElementById('total-generado');
const totalMonedero = document.getElementById('total-monedero');

let turnos = [];
let total = 0;

formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const fecha = document.getElementById('fecha').value;

  if (!nombre || !email || !fecha) {
    mostrarMensaje('Por favor completá todos los campos.');
    return;
  }

  const monto = 1000; // Valor fijo del turno

  const nuevoTurno = { nombre, email, fecha, monto };
  turnos.push(nuevoTurno);
  total += monto;

  mostrarTurnos();
  actualizarTotales();
  formulario.reset();
  mostrarMensaje('Turno agendado con éxito.');
});

function mostrarTurnos() {
  lista.innerHTML = '';

  turnos.forEach((t, index) => {
    const li = document.createElement('li');
    li.textContent = `${t.nombre} - ${t.email} - ${t.fecha} - $${t.monto}`;

    const btn = document.createElement('button');
    btn.textContent = 'Eliminar';
    btn.classList.add('borrar-turno');
    btn.onclick = () => eliminarTurno(index);

    li.appendChild(btn);
    lista.appendChild(li);
  });
}

function eliminarTurno(index) {
  total -= turnos[index].monto;
  turnos.splice(index, 1);
  mostrarTurnos();
  actualizarTotales();
  mostrarMensaje('Turno eliminado.');
}

function actualizarTotales() {
  totalGenerado.textContent = `Total generado: $${total}`;
  totalMonedero.textContent = `Total en monedero: $${total}`;
}

function mostrarMensaje(texto) {
  mensaje.textContent = texto;
  setTimeout(() => mensaje.textContent = '', 3000);
}
