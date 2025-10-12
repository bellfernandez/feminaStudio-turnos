// script.js
//Datos: array de servicios 
const servicios = [
  { id: 1, nombre: "Uñas Esculpidas", duracion: "120 min" },
  { id: 2, nombre: "Semipermanente en manos", duracion: "30 min" },
  { id: 3, nombre: "Capping gel", duracion: "90 min" },
  { id: 4, nombre: "Soft Gel", duracion: "120 min" },
  { id: 5, nombre: "Servicio de pies", duracion: "40 min" },
  { id: 6, nombre: "depilacion de cejas con hilo", duracion: "20 min" },
  { id: 7, nombre: "Laminado de cejas", duracion: "70 min" },
  { id: 8, nombre: "Lifting de pestañas", duracion: "50 min" },
  { id: 9, nombre: "Microblandig de cejas", duracion: "180 min" },
  { id: 10, nombre: "Hidragloss Labial", duracion: "30 min" }
];

// elementos del HTML
const carouselInner = document.getElementById('carousel-inner');
const contenedorTurnos = document.getElementById('turnos-list');
const inputServicio = document.getElementById('servicioSeleccionado');
const inputFecha = document.getElementById('fechaSeleccionada');
const inputHora = document.getElementById('horaSeleccionada');

const form = document.getElementById('turnoFormulario');

// Modal elements
const modalEl = document.getElementById('modalFechaHora');
const modalServicioNombre = document.getElementById('modalServicioNombre');
const modalFecha = document.getElementById('modalFecha');
const modalHora = document.getElementById('modalHora');
const modalError = document.getElementById('modalError');
const modalConfirmarBtn = document.getElementById('modalConfirmar');
const bsModal = new bootstrap.Modal(modalEl);

// Local storage para turnos
let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
let contador = turnos.length > 0 ? turnos[turnos.length - 1].numero : 0;

// slides del carousel
const perSlide = 3;
for (let i = 0; i < servicios.length; i += perSlide) {
  const slice = servicios.slice(i, i + perSlide);

  const item = document.createElement('div');
  item.className = 'carousel-item';
  if (i === 0) item.classList.add('active');

  const row = document.createElement('div');
  row.className = 'd-flex justify-content-start gap-3 p-3';

  slice.forEach(serv => {
    const card = document.createElement('div');
    card.className = 'card servicio-card';
    card.style.width = '12rem';
    card.innerHTML = `
      <div class="card-body d-flex flex-column">
        <h6 class="card-title">${serv.nombre}</h6>
        <p class="card-text text-muted small mb-3">${serv.duracion}</p>
        <button class="btn btn-outline-primary mt-auto btn-elegir" type="button" data-id="${serv.id}">Elegir servicio</button>
      </div>
    `;
    row.appendChild(card);
  });

  item.appendChild(row);
  carouselInner.appendChild(item);
}

//click en "Elegir servicio"
carouselInner.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-elegir');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const servicio = servicios.find(s => s.id === id);
  if (!servicio) return;

  // prellenar servicio
  modalServicioNombre.textContent = servicio.nombre;
  modalFecha.value = ''; // limpia
  modalHora.value = '';
  modalError.classList.add('d-none');
  bsModal.show();

  // confirmar formulario
  modalConfirmarBtn.onclick = () => {
    if (!modalFecha.value || !modalHora.value) {
      modalError.classList.remove('d-none');
      return;
    }
    // datos del formulario
    inputServicio.value = servicio.nombre;
    inputFecha.value = modalFecha.value;
    inputHora.value = modalHora.value;
    bsModal.hide();
  };
});

//mostrar turnos
function imprimirTurnos() {
  contenedorTurnos.innerHTML = '';

  // función de orden superior: forEach 
  turnos.forEach(turno => {
    const card = document.createElement('div');
    card.className = 'card mb-2';
    card.innerHTML = `
      <div class="card-body d-flex align-items-center justify-content-between">
        <div>
          <h6 class="mb-1">Turno N° ${turno.numero}</h6>
          <div>${turno.nombreCliente} ${turno.apellidoCliente}</div>
          <div class="text-muted small">${turno.servicio} • ${turno.fecha} ${turno.hora}</div>
        </div>
        <button class="btn btn-success btn-sm btn-atender" data-num="${turno.numero}">Atender</button>
      </div>
    `;
    contenedorTurnos.appendChild(card);
  });

  // asignar eventos a botones "Atender"
  contenedorTurnos.querySelectorAll('.btn-atender').forEach(b => {
    b.addEventListener('click', () => {
      const num = Number(b.dataset.num);
      atenderTurno(num);
    });
  });
}

//Agregar turno
function agregarTurno(nombre, apellido, servicio, fecha, hora) {
  contador++;
  const nuevo = { numero: contador, nombre, apellido, servicio, fecha, hora };
  turnos.push(nuevo);
  localStorage.setItem('turnos', JSON.stringify(turnos));
  imprimirTurnos();
}

// eliminar turno
function atenderTurno(numero) {
  turnos = turnos.filter(t => t.numero !== numero);
  localStorage.setItem('turnos', JSON.stringify(turnos));
  imprimirTurnos();
}

//enviar al formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombreCliente').value.trim();
  const apellido = document.getElementById('apellidoCliente').value.trim();
  const servicio = inputServicio.value.trim();
  const fecha = inputFecha.value;
  const hora = inputHora.value;

  if (!nombre || !apellido || !servicio || !fecha || !hora) {
    
    return;
  }

  agregarTurno(nombre, apellido, servicio, fecha, hora);
  form.reset();
  inputServicio.value = '';
  inputFecha.value = '';
  inputHora.value = '';
});

// iniciar la lista
imprimirTurnos();