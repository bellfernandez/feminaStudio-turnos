let servicios = []; 

async function cargarServicios() {
  try {
    const res = await fetch('js/servicios.json');
    if (!res.ok) throw new Error('No se pudo cargar servicios');
    servicios = await res.json();
    renderizarCarousel(servicios);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los servicios. Intentá recargar la página.'
    });
  } finally {
    
  }
}

// render carousel //
function renderizarCarousel(serviciosList) {
  const carouselInner = document.getElementById('carousel-inner');
  carouselInner.innerHTML = '';

  const perSlide = 3;
  for (let i = 0; i < serviciosList.length; i += perSlide) {
    const slice = serviciosList.slice(i, i + perSlide);
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
         <button class="btn btn-primary btn-elegir" data-id="${servicio.id}">Elegir</button>
         </div>
      `;
      row.appendChild(card);
    });

    item.appendChild(row);
    carouselInner.appendChild(item);
  }
}

// ejecuta la carga
cargarServicios();