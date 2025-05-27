document.addEventListener('DOMContentLoaded', () => {
  // Scroll suave para los links del menú
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Botones de agendar turno desde cada curso
  document.querySelectorAll('.agendar-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.getElementById('curso').value = this.dataset.curso;
      document.getElementById('agenda').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Manejo de turnos
  const form = document.getElementById('form-turno');
  const listaTurnos = document.getElementById('lista-turnos');
  let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

  function renderTurnos() {
    listaTurnos.innerHTML = '';
    if (turnos.length === 0) {
      listaTurnos.innerHTML = '<li>No hay turnos agendados.</li>';
      return;
    }
    turnos.forEach((t, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${t.nombre}</strong> (${t.email}) - <em>${t.curso}</em> el <span>${t.fecha}</span>
        <button class="borrar-turno" data-index="${i}">Borrar</button>`;
      listaTurnos.appendChild(li);
    });
  }

  renderTurnos();

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const curso = document.getElementById('curso').value;
    const fecha = document.getElementById('fecha').value;

    if (nombre && email && curso && fecha) {
      turnos.push({ nombre, email, curso, fecha });
      localStorage.setItem('turnos', JSON.stringify(turnos));
      renderTurnos();
      form.reset();
      alert('¡Turno agendado con éxito!');
    }
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

document.addEventListener('DOMContentLoaded', () => {
  // Scroll suave para los links del menú
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Botones de agendar turno desde cada curso
  document.querySelectorAll('.agendar-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.getElementById('curso').value = this.dataset.curso;
      document.getElementById('agenda').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Manejo de turnos y dinero
  const form = document.getElementById('form-turno');
  const listaTurnos = document.getElementById('lista-turnos');
  const totalMonedero = document.getElementById('total-monedero');
  const totalGenerado = document.getElementById('total-generado');

  let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
  let totalGlobal = parseFloat(localStorage.getItem('totalGlobal')) || 0;

  function renderTurnos() {
    listaTurnos.innerHTML = '';
    let totalUsuario = 0;
    if (turnos.length === 0) {
      listaTurnos.innerHTML = '<li>No hay turnos agendados.</li>';
      totalMonedero.textContent = '$0';
      return;
    }
    turnos.forEach((t, i) => {
      totalUsuario += Number(t.dinero || 0);
      const li = document.createElement('li');
      li.innerHTML = `<strong>${t.nombre}</strong> (${t.email}) - <em>${t.curso}</em> el <span>${t.fecha}</span>
        <span style="margin-left:10px;">$${t.dinero}</span>
        <button class="borrar-turno" data-index="${i}">Borrar</button>`;
      listaTurnos.appendChild(li);
    });
    totalMonedero.textContent = `$${totalUsuario}`;
  }

  function renderTotalGlobal() {
    totalGenerado.textContent = `$${totalGlobal}`;
  }

  renderTurnos();
  renderTotalGlobal();

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const curso = document.getElementById('curso').value;
    const fecha = document.getElementById('fecha').value;
    const dinero = parseFloat(document.getElementById('dinero').value) || 0;

    if (nombre && email && curso && fecha) {
      turnos.push({ nombre, email, curso, fecha, dinero });
      localStorage.setItem('turnos', JSON.stringify(turnos));
      totalGlobal += dinero;
      localStorage.setItem('totalGlobal', totalGlobal);
      renderTurnos();
      renderTotalGlobal();
      form.reset();
      alert('¡Turno agendado con éxito!');
    }
  });

  listaTurnos.addEventListener('click', function(e) {
    if (e.target.classList.contains('borrar-turno')) {
      const idx = e.target.dataset.index;
      if (confirm('¿Seguro que querés borrar este turno?')) {
        // Restar del global el dinero de ese turno
        totalGlobal -= Number(turnos[idx].dinero || 0);
        localStorage.setItem('totalGlobal', totalGlobal);
        turnos.splice(idx, 1);
        localStorage.setItem('turnos', JSON.stringify(turnos));
        renderTurnos();
        renderTotalGlobal();
      }
    }
  });
});