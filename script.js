document.addEventListener('DOMContentLoaded', () => {
  // Bloquear fechas pasadas y el mismo día
  const fechaInput = document.getElementById('fecha');
  const hoy = new Date();
  hoy.setDate(hoy.getDate() + 1); // mañana
  fechaInput.min = hoy.toISOString().split('T')[0];

  const form = document.getElementById('form-turno');
  const listaTurnos = document.getElementById('lista-turnos');
  const horarioSelect = document.getElementById('horario');

  // Si tu página principal es para un curso específico, cambia este valor:
  const curso = "Cripto"; // O "Trading", "Marketing Digital", "Diseño", según corresponda

  function getInstructorName(curso) {
    switch (curso) {
      case 'Cripto': return 'Juan Pérez';
      case 'Trading': return 'Ana Gómez';
      case 'Marketing Digital': return 'Sofía López';
      case 'Diseño': return 'Carlos Ruiz';
      default: return 'Instructor/a';
    }
  }

  let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

  function renderTurnos() {
    listaTurnos.innerHTML = '';
    if (turnos.length === 0) {
      listaTurnos.innerHTML = '<li>No hay turnos agendados.</li>';
      return;
    }
    turnos.forEach((t, i) => {
      const instructor = t.instructor || getInstructorName(t.curso);
      const li = document.createElement('li');
      li.className = 'turno-card';
      li.innerHTML = `
        <div class="turno-info">
          <span class="turno-curso">${t.curso}</span>
          <span class="turno-fecha">${t.fecha} - ${t.horario} hs</span>
          <span class="turno-nombre">${t.nombre} (${t.email})</span>
          <span class="turno-instructor">Instructor: <b>${instructor}</b></span>
        </div>
        <button class="borrar-turno" data-index="${i}">Borrar</button>
      `;
      listaTurnos.appendChild(li);
    });
  }

  renderTurnos();

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const fecha = fechaInput.value;
    const horario = horarioSelect.value;
    const instructor = getInstructorName(curso);

    // Validar que no haya turno en el mismo curso, fecha y horario
    const existe = turnos.some(t => t.curso === curso && t.fecha === fecha && t.horario === horario);
    if (existe) {
      alert('Ya hay un turno reservado para ese curso, fecha y horario con este instructor.');
      return;
    }

    turnos.push({ nombre, email, curso, fecha, horario, instructor });
    localStorage.setItem('turnos', JSON.stringify(turnos));
    renderTurnos();
    form.reset();
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