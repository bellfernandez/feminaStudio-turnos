// elementos
const contenedorTurnos = document.getElementById('turnos-list');
const inputServicio = document.getElementById('servicioSeleccionado');
const inputFecha = document.getElementById('fechaSeleccionada');
const inputHora = document.getElementById('horaSeleccionada');
const form = document.getElementById('turnoFormulario');

const modalEl = document.getElementById('modalFechaHora');
const modalServicioNombre = document.getElementById('modalServicioNombre');
const modalFecha = document.getElementById('modalFecha');
const modalHora = document.getElementById('modalHora');
const modalError = document.getElementById('modalError');
const modalConfirmarBtn = document.getElementById('modalConfirmar');
const bsModal = new bootstrap.Modal(modalEl);

const btnLoginAdmin = document.getElementById('btn-login-admin');
const btnLogoutAdmin = document.getElementById('btn-logout-admin');

let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
let contador = turnos.length > 0 ? turnos[turnos.length - 1].numero : 0;
let isAdmin = false; // sesión admin básica


function fechaHoyFormato() {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
const hoyStr = fechaHoyFormato();
modalFecha.min = hoyStr;
inputFecha.min = hoyStr; 

// reglas de horario
const HORA_MIN = "08:00";
const HORA_MAX = "20:00";

function horaValida(hora) {
  return hora >= HORA_MIN && hora <= HORA_MAX;
}

// Manejo admin 
btnLoginAdmin.addEventListener('click', async () => {
  const { value: password } = await Swal.fire({
    title: 'Contraseña admin',
    input: 'password',
    inputPlaceholder: 'Ingresá la contraseña',
    showCancelButton: true
  });

  if (password) {
    if (password === 'admin123') {
      isAdmin = true;
      btnLoginAdmin.classList.add('d-none');
      btnLogoutAdmin.classList.remove('d-none');
      Swal.fire({ icon: 'success', title: 'Bienvenido admin' });
      imprimirTurnos(); // muestra botones
    } else {
      Swal.fire({ icon: 'error', text: 'Contraseña incorrecta' });
    }
  }
});

btnLogoutAdmin.addEventListener('click', () => {
  isAdmin = false;
  btnLoginAdmin.classList.remove('d-none');
  btnLogoutAdmin.classList.add('d-none');
  Swal.fire({ icon: 'info', text: 'Cerraste sesión admin' });
  imprimirTurnos();
});

// CLICK en elegir servicio
document.getElementById('carousel-inner').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-elegir');
  if (!btn) return;
  const id = Number(btn.dataset.id);

  const servicio = (typeof servicios !== 'undefined') ? servicios.find(s => s.id === id) : null;
  if (!servicio) {
    Swal.fire({ icon: 'error', text: 'Servicio no encontrado' });
    return;
  }

  modalServicioNombre.textContent = servicio.nombre;
  modalFecha.value = '';
  modalHora.value = '';
  modalError.classList.add('d-none');
  bsModal.show();

  modalConfirmarBtn.onclick = () => {
    if (!modalFecha.value || !modalHora.value) {
      modalError.classList.remove('d-none');
      return;
    }
    if (modalFecha.value < hoyStr) {
      modalError.textContent = 'No se permiten fechas anteriores a hoy.';
      modalError.classList.remove('d-none');
      return;
    }
    if (!horaValida(modalHora.value)) {
      modalError.textContent = `Solo se permiten horas entre ${HORA_MIN} y ${HORA_MAX}.`;
      modalError.classList.remove('d-none');
      return;
    }

    inputServicio.value = servicio.nombre;
    inputFecha.value = modalFecha.value;
    inputHora.value = modalHora.value;
    bsModal.hide();
  };
});

// imprimir turnos
function imprimirTurnos() {
  contenedorTurnos.innerHTML = '';

  turnos.forEach(turno => {
    const card = document.createElement('div');
    card.className = 'card mb-2';
    card.innerHTML = `
      <div class="card-body d-flex align-items-center justify-content-between">
        <div>
          <h6 class="mb-1">Turno N° ${turno.numero}</h6>
          <div>${turno.nombre} ${turno.apellido}</div>
          <div class="text-muted small">${turno.servicio} • ${turno.fecha} ${turno.hora}</div>
        </div>
        <div class="d-flex gap-2 align-items-center">
          ${ isAdmin ? `<button class="btn btn-success btn-sm btn-atender" data-num="${turno.numero}">Atender</button>` : '' }
        </div>
      </div>
    `;
    contenedorTurnos.appendChild(card);
  });

  // asignar eventos: admin
  if (isAdmin) {
    contenedorTurnos.querySelectorAll('.btn-atender').forEach(b => {
      b.addEventListener('click', () => {
        const num = Number(b.dataset.num);
        atenderTurno(num);
      });
    });
  }
}

// agregar turno (con try-catch-finally)
function agregarTurno(nombre, apellido, servicio, fecha, hora) {
  try {
    contador++;
    const nuevo = { numero: contador, nombre, apellido, servicio, fecha, hora };
    turnos.push(nuevo);
    localStorage.setItem('turnos', JSON.stringify(turnos));
    Swal.fire({ icon: 'success', text: `Turno reservado. N° ${nuevo.numero}` });
    imprimirTurnos();
  } catch (error) {
    Swal.fire({ icon: 'error', text: 'No se pudo guardar el turno' });
  } finally {
    
  }
}

// atender turno (solo admin)
function atenderTurno(numero) {
  turnos = turnos.filter(t => t.numero !== numero);
  localStorage.setItem('turnos', JSON.stringify(turnos));
  Swal.fire({ icon: 'success', text: `Turno N° ${numero} atendido` });
  imprimirTurnos();
}

// submit del formulario con validaciones
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombreCliente').value.trim();
  const apellido = document.getElementById('apellidoCliente').value.trim();
  const servicio = inputServicio.value.trim();
  const fecha = inputFecha.value;
  const hora = inputHora.value;

  // validaciones
  if (!nombre || !apellido || !servicio || !fecha || !hora) {
    Swal.fire({ icon: 'warning', text: 'Completá todos los campos' });
    return;
  }
  if (fecha < hoyStr) {
    Swal.fire({ icon: 'warning', text: 'No podés elegir una fecha anterior a hoy' });
    return;
  }
  if (!horaValida(hora)) {
    Swal.fire({ icon: 'warning', text: `Horario inválido. Solo ${HORA_MIN} - ${HORA_MAX}` });
    return;
  }

  // agregar turno con try-catch-finally
  try {
    agregarTurno(nombre, apellido, servicio, fecha, hora);
    // reset del formulario
    form.reset();
    inputServicio.value = '';
    inputFecha.value = '';
    inputHora.value = '';
  } catch (err) {
    Swal.fire({ icon: 'error', text: 'Error al crear el turno' });
  } finally {
    
    imprimirTurnos();
  }
});

// iniciar lista al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  imprimirTurnos();
});