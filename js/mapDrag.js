const map = document.querySelector('#map');
const mapOverlay = document.querySelector('.map-overlay')


let isDragging = false;
let startX = 0;
let startY = 0;

let offsetX = 0;
let offsetY = 0;

let scale = 2;
const minScale = 1;
const maxScale = 2;
const zoomSpeed = 0.2;

export let moved = false;

// --- Funciones Auxiliares para Limitar el Arrastre ---

function calculateBounds() {
    // 1. Obtener dimensiones del mapa y su CONTENEDOR (Viewport)

    // ➡️ CAMBIO CLAVE: Usamos las dimensiones de la ventana para limitar el arrastre
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    // 2. Obtener dimensiones BASE del mapa (sin transformar)
    // Usamos el width/height de la ventana para que el mapa se comporte bien
    // si el SVG está configurado para llenar el 100% de la pantalla.
    const mapWidth = containerWidth;
    const mapHeight = containerHeight;

    // 3. Calcular las dimensiones del mapa escalado
    const scaledWidth = mapWidth * scale;
    const scaledHeight = mapHeight * scale;

    // 4. Calcular el exceso de tamaño del mapa que puede ser arrastrado (Delta)
    let limitX = (scaledWidth - containerWidth) / 2;
    let limitY = (scaledHeight - containerHeight) / 2;

    // Si el mapa es más pequeño que el contenedor después del zoom (scale < 1)
    if (scaledWidth < containerWidth) {
        limitX = 0;
    }
    if (scaledHeight < containerHeight) {
        limitY = 0;
    }

    // Devolvemos los límites:
    return {
        minX: -limitX,
        maxX: limitX,
        minY: -limitY,
        maxY: limitY
    };
}

function clampOffset(newOffset, min, max) {
    // La función Math.min(Math.max(value, min), max) limita 'value'
    return Math.min(Math.max(newOffset, min), max);
}

// --- Event Listeners y Funciones de Arrastre ---

// drag
map.addEventListener("mousedown", startDrag);
map.addEventListener("touchstart", startDrag, { passive: false });

map.addEventListener("mousemove", drag);
map.addEventListener("touchmove", drag, { passive: false });

map.addEventListener("mouseup", endDrag);
map.addEventListener("mouseleave", endDrag);
map.addEventListener("touchend", endDrag);

function startDrag(e) {
    isDragging = true;
    moved = false;

    const p = e.touches ? e.touches[0] : e;

    startX = p.clientX - offsetX;
    startY = p.clientY - offsetY;
}

function drag(e) {
    if (!isDragging) return;

    e.preventDefault();
    const p = e.touches ? e.touches[0] : e;

    const newX = p.clientX - startX;
    const newY = p.clientY - startY;

    // Calculamos los límites basados en el zoom y las dimensiones
    const bounds = calculateBounds();

    // ➡️ APLICAMOS LA LIMITACIÓN (CLAMPING)
    offsetX = clampOffset(newX, bounds.minX, bounds.maxX);
    offsetY = clampOffset(newY, bounds.minY, bounds.maxY);

    // si hubo movimiento (usando los valores limitados)
    if (Math.abs(offsetX - newX) > 3 || Math.abs(offsetY - newY) > 3) {
        // En este caso, la lógica de 'moved' debería considerar el movimiento real de los dedos
        // en relación a los límites, pero por simplicidad, podemos usar una comprobación de
        // movimiento de mouse/touch significativa:
        moved = Math.abs(newX - (p.clientX - startX)) > 3 || Math.abs(newY - (p.clientY - startY)) > 3;
    } else {
        moved = true; // Si llegamos aquí y estamos arrastrando, consideramos que hubo movimiento
    }


    // console.log('offsetX:', offsetX, 'BoundsX:', bounds.minX, bounds.maxX);
    // console.log('offsetY', offsetY, 'BoundsY:', bounds.minY, bounds.maxY);

    applyTransform();
}

function endDrag(e) {
    if (moved) {
        e.stopPropagation();
        e.preventDefault();
    }
    isDragging = false;
}

// --- Funciones de Zoom ---

// zoom
map.addEventListener("wheel", onZoom, { passive: false });

function onZoom(e) {
    e.preventDefault();

    const direction = e.deltaY > 0 ? -1 : 1;

    // 1. Aplicar nuevo zoom
    scale += direction * zoomSpeed;
    scale = Math.max(minScale, Math.min(maxScale, scale));

    // 2. Recalcular los límites
    const bounds = calculateBounds();

    // 3. ➡️ LIMITAR los offsets existentes después del zoom
    // Esto asegura que si el zoom 'acerca' el mapa a los límites,
    // el mapa no se quede fuera de vista.
    offsetX = clampOffset(offsetX, bounds.minX, bounds.maxX);
    offsetY = clampOffset(offsetY, bounds.minY, bounds.maxY);


    applyTransform();
}


// render
function applyTransform() {
    map.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

    // drag overlay cruces
    if (mapOverlay) {
        mapOverlay.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1)`;
    }
}

