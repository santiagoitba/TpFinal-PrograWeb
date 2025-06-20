// --- CONFIGURACIÓN POR CATEGORÍA ---
const categorias = {
  'cripto.html': {
    storageTurnos: 'turnosCripto',
    storageInstructores: 'instructoresComunidad',
    storageUsuario: 'usuarioComunidad',
    categoria: 'Cripto'
  },
  'trading.html': {
    storageTurnos: 'turnosTrading',
    storageInstructores: 'instructoresComunidadTrading',
    storageUsuario: 'usuarioComunidadTrading',
    categoria: 'Trading'
  },
  'diseno.html': {
    storageTurnos: 'turnosDiseno',
    storageInstructores: 'instructoresComunidadDiseno',
    storageUsuario: 'usuarioComunidadDiseno',
    categoria: 'Diseño'
  },
  'marketing.html': {
    storageTurnos: 'turnosMarketing',
    storageInstructores: 'instructoresComunidadMarketing',
    storageUsuario: 'usuarioComunidadMarketing',
    categoria: 'Marketing Digital'
  }
};

function getCategoriaActual() {
  const path = window.location.pathname.split('/').pop();
  return categorias[path] || categorias['cripto.html'];
}

// --- ACTUALIZAR INSTRUCTORES ANTIGUOS ---
(function () {
  const cat = getCategoriaActual();
  let usuario = localStorage.getItem(cat.storageUsuario);
  if (!usuario && document.getElementById('form-comunidad')) {
    usuario = prompt('Por favor, ingresá tu nombre de usuario para administrar tus instructores de comunidad:');
    if (usuario) {
      localStorage.setItem(cat.storageUsuario, usuario);
    }
  }
  let instructores = JSON.parse(localStorage.getItem(cat.storageInstructores)) || [];
  let actualizado = false;
  instructores = instructores.map(i => {
    if (!i.usuario && usuario) {
      actualizado = true;
      return {...i, usuario: usuario};
    }
    return i;
  });
  if (actualizado) {
    localStorage.setItem(cat.storageInstructores, JSON.stringify(instructores));
  }
})();

// --- FUNCIONES GENERALES ---
function setMinDate(inputs) {
  const hoy = new Date();
  hoy.setDate(hoy.getDate() + 1);
  const min = hoy.toISOString().split('T')[0];
  inputs.forEach(input => input.min = min);
}

function renderComunidadInstructores() {
  const cat = getCategoriaActual();
  const instructores = JSON.parse(localStorage.getItem(cat.storageInstructores)) || [];
  const grid = document.getElementById('comunidad-instructores');
  if (!grid) return;
  grid.innerHTML = '';
  const usuarioActual = localStorage.getItem(cat.storageUsuario);
  instructores.forEach((inst, idx) => {
    const puedeEliminar = inst.usuario === usuarioActual;
    const card = document.createElement('div');
    card.className = 'instructor-card comunidad-card';
    card.innerHTML = `
      <img src="${inst.img}" alt="${inst.nombre}" class="instructor-img" />
      <h3>${inst.nombre}</h3>
      <p class="instructor-desc">${inst.descripcion}</p>
      <div class="instructor-precio">Precio por turno: <b>$${inst.precio}</b></div>
      <form class="form-turno-comunidad">
        <input type="hidden" class="instructor-nombre" value="${inst.nombre}" />
        <input type="hidden" class="instructor-categoria" value="${cat.categoria}" />
        <input type="hidden" class="instructor-precio-input" value="${inst.precio}" />
        <label>Tu nombre:</label>
        <input type="text" class="nombre" placeholder="Ej: Juan Pérez" required />
        <label>Tu email:</label>
        <input type="email" class="email" placeholder="Ej: juan@email.com" required />
        <label>Fecha:</label>
        <input type="date" class="fecha" required />
        <label>Horario:</label>
        <select class="horario" required>
          <option value="">Elegí un horario</option>
          <option value="09:00">09:00</option>
          <option value="11:00">11:00</option>
          <option value="14:00">14:00</option>
          <option value="16:00">16:00</option>
          <option value="18:00">18:00</option>
        </select>
        <button type="submit">Agendar turno</button>
      </form>
      ${puedeEliminar ? `<button class="eliminar-instructor" data-index="${idx}">Eliminar instructor</button>` : ''}
    `;
    grid.appendChild(card);
  });
  setMinDate(Array.from(document.querySelectorAll('.fecha')));
}

function renderTurnos() {
  const cat = getCategoriaActual();
  const lista = document.getElementById('lista-turnos');
  if (!lista) return;
  const turnos = JSON.parse(localStorage.getItem(cat.storageTurnos)) || [];
  lista.innerHTML = '';
  if (turnos.length === 0) {
    lista.innerHTML = '<li>No hay turnos agendados.</li>';
    return;
  }
  turnos.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = 'turno-card';
    li.innerHTML = `
      <div class="turno-info">
        <span class="turno-categoria"><b>Categoría:</b> ${t.categoria}</span>
        <span class="turno-instructor"><b>Instructor:</b> ${t.instructor}</span>
        <span class="turno-nombre"><b>Nombre:</b> ${t.nombre}</span>
        <span class="turno-mail"><b>Email:</b> ${t.email}</span>
        <span class="turno-fecha"><b>Fecha:</b> ${t.fecha}</span>
        <span class="turno-horario"><b>Horario:</b> ${t.horario} hs</span>
        <span class="turno-precio"><b>Precio:</b> $${t.precio}</span>
      </div>
      <div class="turno-acciones">
        <button class="editar-turno" data-index="${i}">Editar</button>
        <button class="borrar-turno" data-index="${i}">Borrar</button>
      </div>
    `;
    lista.appendChild(li);
  });
}

// --- EVENTOS GENERALES ---
let editIndex = null;

document.addEventListener('DOMContentLoaded', function () {
  renderComunidadInstructores();
  renderTurnos();
  setMinDate(Array.from(document.querySelectorAll('.fecha')));
});

document.body.addEventListener('submit', function(e) {
  if (e.target.classList.contains('form-turno-comunidad')) {
    e.preventDefault();
    const cat = getCategoriaActual();
    const form = e.target;
    const nombre = form.querySelector('.nombre').value.trim();
    const email = form.querySelector('.email').value.trim();
    const fecha = form.querySelector('.fecha').value;
    const horario = form.querySelector('.horario').value;
    const instructor = form.querySelector('.instructor-nombre').value;
    const categoria = form.querySelector('.instructor-categoria').value;
    const precio = form.querySelector('.instructor-precio-input').value;

    let turnos = JSON.parse(localStorage.getItem(cat.storageTurnos)) || [];

    // Validar que no haya turno en el mismo horario con el mismo instructor (excepto si está editando el mismo)
    const existe = turnos.some((t, idx) =>
      t.instructor === instructor && t.fecha === fecha && t.horario === horario && idx !== editIndex
    );
    if (existe) {
      alert('Ya hay un turno reservado para ese instructor, fecha y horario.');
      return;
    }

    if (editIndex !== null) {
      // Editar turno
      turnos[editIndex] = { nombre, email, fecha, horario, instructor, categoria, precio };
      editIndex = null;
    } else {
      // Crear turno
      turnos.push({ nombre, email, fecha, horario, instructor, categoria, precio });
    }
    localStorage.setItem(cat.storageTurnos, JSON.stringify(turnos));
    renderTurnos();
    form.reset();
    alert('¡Turno guardado con éxito!');
  }
});

document.addEventListener('click', function(e) {
  const cat = getCategoriaActual();
  // Eliminar instructor de comunidad
  if (e.target.classList.contains('eliminar-instructor')) {
    const idx = e.target.dataset.index;
    const instructores = JSON.parse(localStorage.getItem(cat.storageInstructores)) || [];
    const instructorEliminado = instructores[idx];
    if (instructorEliminado.usuario === localStorage.getItem(cat.storageUsuario)) {
      if (confirm('¿Seguro que querés eliminarte como instructor?')) {
        instructores.splice(idx, 1);
        localStorage.setItem(cat.storageInstructores, JSON.stringify(instructores));
        // Eliminar turnos asociados a ese instructor
        let turnos = JSON.parse(localStorage.getItem(cat.storageTurnos)) || [];
        turnos = turnos.filter(t => t.instructor !== instructorEliminado.nombre);
        localStorage.setItem(cat.storageTurnos, JSON.stringify(turnos));
        renderComunidadInstructores();
        renderTurnos();
      }
    } else {
      alert('Solo el usuario que creó este instructor puede eliminarlo.');
    {  
    }
  }
  }
  // Borrar y editar turnos
  if (e.target.classList.contains('borrar-turno') || e.target.classList.contains('editar-turno')) {
    let turnos = JSON.parse(localStorage.getItem(cat.storageTurnos)) || [];
    if (e.target.classList.contains('borrar-turno')) {
      const idx = e.target.dataset.index;
      if (confirm('¿Seguro que querés borrar este turno?')) {
        turnos.splice(idx, 1);
        localStorage.setItem(cat.storageTurnos, JSON.stringify(turnos));
        renderTurnos();
      }
    }
    if (e.target.classList.contains('editar-turno')) {
      const idx = e.target.dataset.index;
      const t = turnos[idx];
      // Buscar el form del instructor correspondiente
      let form = null;
      document.querySelectorAll('.form-turno-comunidad').forEach(f => {
        if (
          f.querySelector('.instructor-nombre').value === t.instructor &&
          f.querySelector('.instructor-categoria').value === t.categoria
        ) {
          form = f;
        }
      });
      if (form) {
        form.querySelector('.nombre').value = t.nombre;
        form.querySelector('.email').value = t.email;
        form.querySelector('.fecha').value = t.fecha;
        form.querySelector('.horario').value = t.horario;
        editIndex = parseInt(idx);
        form.scrollIntoView({ behavior: 'smooth' });
      } else {
        alert('No se encontró el formulario para editar este turno.');
      }
    }
  }
});

// Guardar instructor de la comunidad
document.addEventListener('submit', function(e) {
  if (e.target && e.target.id === 'form-comunidad') {
    e.preventDefault();
    const cat = getCategoriaActual();
    const nombre = document.getElementById('nombre-comunidad').value.trim();
    const descripcion = document.getElementById('especialidad-comunidad').value.trim();
    const precio = document.getElementById('precio-comunidad').value.trim();
    const imgInput = document.getElementById('img-comunidad');
    const file = imgInput.files[0];

    if (!file) return;

    // Guardar usuario para control de eliminación
    localStorage.setItem(cat.storageUsuario, nombre);

    const reader = new FileReader();
    reader.onload = function(evt) {
      const img = evt.target.result;
      const instructores = JSON.parse(localStorage.getItem(cat.storageInstructores)) || [];
      instructores.push({ nombre, descripcion, precio, img, usuario: nombre });
      localStorage.setItem(cat.storageInstructores, JSON.stringify(instructores));
      renderComunidadInstructores();
      document.getElementById('form-comunidad').reset();
    };
    reader.readAsDataURL(file);
  }
});