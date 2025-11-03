let servicios = []; 

// cargar servicios desde JSON
async function cargarServicios() {
  try {
    const res = await fetch('./js/servicios.json');
    if (!res.ok) throw new Error('No se pudo cargar servicios');
    servicios = await res.json();
    renderizarCarousel(servicios);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los servicios. Intentá recargar la página.'
    });
  }
}

// renderizar carrusel con 3 cards por slide
function renderizarCarousel(serviciosList) {
  const carouselInner = document.getElementById('carousel-inner');
  carouselInner.innerHTML = '';

  const perSlide = 3; // cards por slide
  for (let i = 0; i < serviciosList.length; i += perSlide) {
    const slice = serviciosList.slice(i, i + perSlide);

    const item = document.createElement('div');
    item.className = 'carousel-item';
    if (i === 0) item.classList.add('active');

    const row = document.createElement('div');
    row.className = 'row justify-content-center g-3 p-3';

    slice.forEach(serv => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-4'; // 1 por fila mobile, 3 en desktop
      col.innerHTML = `
        <div class="card servicio-card h-100">
          <div class="card-body d-flex flex-column">
            <h6 class="card-title">${serv.nombre}</h6>
            <p class="card-text text-muted small mb-3">${serv.precio}</p>
            <button class="btn btn-primary btn-elegir mt-auto" data-id="${serv.id}">Elegir</button>
          </div>
        </div>
      `;
      row.appendChild(col);
    });

    item.appendChild(row);
    carouselInner.appendChild(item);
  }
}

// ejecutar carga al iniciar
document.addEventListener('DOMContentLoaded', () => {
  cargarServicios();
});