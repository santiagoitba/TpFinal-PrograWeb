document.addEventListener('DOMContentLoaded', () => {
  // Scroll suave para links que usan anclas
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Botones para agendar desde cursos (si los tenés)
  document.querySelectorAll('.agendar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const curso = btn.dataset.curso || '';
      const inputCurso = document.getElementById('curso');
      if (inputCurso) inputCurso.value = curso;
      const agenda = document.getElementById('agenda');
      if (agenda) agenda.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Referencias a elementos del DOM para el formulario de turnos
  const form = document.getElementById('form-turno');
  const listaTurnos = document.getElementById('lista-turnos');
  const totalMonedero = document.getElementById('total-monedero');
  const totalGenerado = document.getElementById('total-generado');
  const mensaje = document.getElementById('mensaje'); // Si querés mostrar mensajes sin alert

  // Cargar turnos y total global desde localStorage o inicializar vacíos
  let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
  let totalGlobal = parseFloat(localStorage.getItem('totalGlobal')) || 0;

  // Función para mostrar los turnos agendados
  function renderTurnos() {
    listaTurnos.innerHTML = '';
    if (turnos.length === 0) {
      listaTurnos.innerHTML = '<li>No hay turnos agendados.</li>';
      totalMonedero.textContent = '$0.00';
      return;
    }
    let totalUsuario = 0;
    turnos.forEach((t, i) => {
      const dineroTurno = Number(t.dinero) || 0;
      totalUsuario += dineroTurno;
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${t.nombre}</strong> (${t.email}) - <em>${t.curso}</em> el <span>${t.fecha}</span>
        <span style="margin-left: 10px;">$${dineroTurno.toFixed(2)}</span>
        <button class="borrar-turno" data-index="${i}" aria-label="Borrar turno de ${t.nombre}">Borrar</button>
      `;
      listaTurnos.appendChild(li);
    });
    totalMonedero.textContent = `$${totalUsuario.toFixed(2)}`;
  }

  // Función para mostrar el total global generado
  function renderTotalGlobal() {
    totalGenerado.textContent = `$${totalGlobal.toFixed(2)}`;
  }

  // Mostrar los datos iniciales al cargar la página
  renderTurnos();
  renderTotalGlobal();

  // Manejar el envío del formulario para agendar un turno
  form.addEventListener('submit', e => {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const curso = form.curso.value.trim();
    const fecha = form.fecha.value;
    let dinero = parseFloat(form.dinero.value);

    // Validaciones básicas
    if (!nombre || !email || !curso || !fecha) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (isNaN(dinero) || dinero < 0) {
      alert('El monto debe ser un número positivo o cero.');
      return;
    }

    // Si dinero está vacío o no numérico, poner 0
    if (!dinero) dinero = 0;

    // Guardar nuevo turno
    turnos.push({ nombre, email, curso, fecha, dinero });
    localStorage.setItem('turnos', JSON.stringify(turnos));

    // Actualizar total global
    totalGlobal += dinero;
    localStorage.setItem('totalGlobal', totalGlobal);

    // Renderizar turnos y total
    renderTurnos();
    renderTotalGlobal();

    // Resetear formulario
    form.reset();

    alert('¡Turno agendado con éxito!');
  });

  // Manejar borrar un turno desde la lista
  listaTurnos.addEventListener('click', e => {
    if (e.target.classList.contains('borrar-turno')) {
      const idx = parseInt(e.target.dataset.index, 10);
      if (confirm('¿Seguro que querés borrar este turno?')) {
        // Actualizar total global restando el dinero del turno a borrar
        totalGlobal -= Number(turnos[idx].dinero) || 0;
        turnos.splice(idx, 1);
        localStorage.setItem('turnos', JSON.stringify(turnos));
        localStorage.setItem('totalGlobal', totalGlobal);
        renderTurnos();
        renderTotalGlobal();
      }
    }
  });
});
