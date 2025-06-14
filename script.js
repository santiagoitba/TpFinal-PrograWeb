
document.addEventListener('DOMContentLoaded', () => {
  // Bloquear fechas pasadas y el mismo día
  const fechaInput = document.getElementById('fecha');
  const hoy = new Date();
  hoy.setDate(hoy.getDate() + 1); // mañana
  fechaInput.min = hoy.toISOString().split('T')[0];

  const form = document.getElementById('form-turno');
  const listaTurnos = document.getElementById('lista-turnos');
  const cursoSelect = document.getElementById('curso');
  const horarioSelect = document.getElementById('horario');
  const instructorInfo = document.getElementById('instructor-info');

  let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

  // Mostrar instructor si es Cripto
  cursoSelect.addEventListener('change', function() {
    if (this.value === 'Cripto') {
      instructorInfo.textContent = 'Instructor: Juan Pérez';
      instructorInfo.style.display = 'block';
    } else {
      instructorInfo.style.display = 'none';
    }
  });

  function renderTurnos() {
    listaTurnos.innerHTML = '';
    if (turnos.length === 0) {
      listaTurnos.innerHTML = '<li>No hay turnos agendados.</li>';
      return;
    }
    turnos.forEach((t, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${t.nombre}</strong> (${t.email}) - <em>${t.curso}</em> el <span>${t.fecha}</span> a las <span>${t.horario}</span>
        <button class="borrar-turno" data-index="${i}">Borrar</button>`;
      listaTurnos.appendChild(li);
    });
  }

  renderTurnos();

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const curso = cursoSelect.value;
    const fecha = fechaInput.value;
    const horario = horarioSelect.value;

    // Validar que no haya turno en el mismo curso, fecha y horario
    const existe = turnos.some(t => t.curso === curso && t.fecha === fecha && t.horario === horario);
    if (existe) {
      alert('Ya hay un turno reservado para ese curso, fecha y horario con este instructor.');
      return;
    }

    turnos.push({ nombre, email, curso, fecha, horario });
    localStorage.setItem('turnos', JSON.stringify(turnos));
    renderTurnos();
    form.reset();
    instructorInfo.style.display = 'none';
    alert('¡Turno agendado con éxito!');
  });

  listaTurnos.addEventListener('click', function(e) {
    if (e.target.classList.contains('borrar-turno')) {
      const idx = e.target.dataset.index;
      if (confirm('¿Seguro que querés borrar este turno?')) {
        turnos.splice(idx, 1);
        localStorage.setItem('turnos', JSON.stringify(turnos));
        renderTurnos();
      }
    }
  });
});