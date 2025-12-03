// console.log('map drag')

// const map = document.querySelector('#map');
// const mapOverlay = document.querySelector('.map-overlay')



// let isDragging = false;
// let startX = 0;
// let startY = 0;

// let offsetX = 0;
// let offsetY = 0;

// let scale = 2;
// const minScale = 1;
// const maxScale = 2;
// const zoomSpeed = 0.2;

// export let moved = false;

// // limitar el drag

// function calculateBounds() {


//     const containerWidth = window.innerWidth;
//     const containerHeight = window.innerHeight;


//     const mapWidth = containerWidth;
//     const mapHeight = containerHeight;

//     const scaledWidth = mapWidth * scale;
//     const scaledHeight = mapHeight * scale;


//     let limitX = (scaledWidth - containerWidth) / 2;
//     let limitY = (scaledHeight - containerHeight) / 2;


//     if (scaledWidth < containerWidth) {
//         limitX = 0;
//     }
//     if (scaledHeight < containerHeight) {
//         limitY = 0;
//     }


//     return {
//         minX: -limitX,
//         maxX: limitX,
//         minY: -limitY,
//         maxY: limitY
//     };
// }

// function clampOffset(newOffset, min, max) {

//     return Math.min(Math.max(newOffset, min), max);
// }

// // Event listeners y funciones de arrastre 

// // drag
// map.addEventListener("mousedown", startDrag);
// map.addEventListener("touchstart", startDrag, { passive: false });

// map.addEventListener("mousemove", drag);
// map.addEventListener("touchmove", drag, { passive: false });

// map.addEventListener("mouseup", endDrag);
// map.addEventListener("mouseleave", endDrag);
// map.addEventListener("touchend", endDrag);

// function startDrag(e) {
//     isDragging = true;
//     moved = false;

//     const p = e.touches ? e.touches[0] : e;

//     startX = p.clientX - offsetX;
//     startY = p.clientY - offsetY;
// }

// function drag(e) {
//     if (!isDragging) return;

//     e.preventDefault();
//     const p = e.touches ? e.touches[0] : e;

//     const newX = p.clientX - startX;
//     const newY = p.clientY - startY;


//     const bounds = calculateBounds();


//     offsetX = clampOffset(newX, bounds.minX, bounds.maxX);
//     offsetY = clampOffset(newY, bounds.minY, bounds.maxY);


//     if (Math.abs(offsetX - newX) > 3 || Math.abs(offsetY - newY) > 3) {

//         moved = Math.abs(newX - (p.clientX - startX)) > 3 || Math.abs(newY - (p.clientY - startY)) > 3;
//     } else {
//         moved = true;
//     }

//     applyTransform();
// }

// function endDrag(e) {
//     if (moved) {
//         e.stopPropagation();
//         e.preventDefault();
//     }
//     isDragging = false;
// }


// // zoom
// map.addEventListener("wheel", onZoom, { passive: false });

// function onZoom(e) {
//     e.preventDefault();

//     const direction = e.deltaY > 0 ? -1 : 1;

//     // nuevo zoom
//     scale += direction * zoomSpeed;
//     scale = Math.max(minScale, Math.min(maxScale, scale));

//     const bounds = calculateBounds();

//     offsetX = clampOffset(offsetX, bounds.minX, bounds.maxX);
//     offsetY = clampOffset(offsetY, bounds.minY, bounds.maxY);

//     applyTransform();
// }


// // render
// function applyTransform() {
//     map.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

//     // drag overlay cruces
//     if (mapOverlay) {
//         mapOverlay.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1)`;
//     }
// }


//----------------------------
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

const map = document.querySelector('#map');
const mapOverlay = document.querySelector('.map-overlay');
const mapContainer = document.querySelector('#map-container'); // Asegúrate de tener un contenedor padre

// --- CONFIGURACIÓN ---
let currentScale = 1; // Mantenemos el estado del scale aquí
const config = {
    minScale: 1,
    maxScale: 3,
    zoomSpeed: 0.2
};

// --- 1. CONFIGURAR DRAGGABLE ---
// Draggable se encargará de mantener la posición X e Y.
const draggableInstance = Draggable.create(map, {
    type: "x,y",
    edgeResistance: 0.65,
    inertia: true, // Opcional, si tienes InertiaPlugin
    onDrag: syncOverlay,      // Sincronizar cruces al arrastrar
    onThrowUpdate: syncOverlay // Sincronizar cruces al lanzar (inercia)
})[0];

// Sincronizar el overlay (cruces) con el mapa
function syncOverlay() {
    if (mapOverlay) {
        gsap.set(mapOverlay, { x: this.x, y: this.y });
    }
}

// --- 2. FUNCIÓN DE LÍMITES (BOUNDS) ---
// Esta función calcula hasta dónde se puede arrastrar el mapa según el zoom actual
function updateBounds() {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    // Dimensiones reales del mapa escalado
    const scaledWidth = containerWidth * currentScale;
    const scaledHeight = containerHeight * currentScale;

    // Calculamos el espacio sobrante (positivo)
    const xOverflow = scaledWidth - containerWidth;
    const yOverflow = scaledHeight - containerHeight;

    // Si el mapa es más grande que la pantalla, los límites son la mitad de ese sobrante
    // Si es más pequeño, los límites son 0 (no se puede mover)
    const minX = xOverflow > 0 ? -xOverflow / 2 : 0;
    const maxX = xOverflow > 0 ? xOverflow / 2 : 0;
    const minY = yOverflow > 0 ? -yOverflow / 2 : 0;
    const maxY = yOverflow > 0 ? yOverflow / 2 : 0;

    // Aplicamos los límites al Draggable
    draggableInstance.applyBounds({ minX, maxX, minY, maxY });
}

// --- 3. LÓGICA DE ZOOM ---
window.addEventListener("wheel", onZoom, { passive: false });

function onZoom(e) {
    // Solo hacemos zoom si estamos sobre el mapa
    if (!e.target.closest('#map-container') && !e.target.closest('#map')) return;

    e.preventDefault();

    const direction = e.deltaY > 0 ? -1 : 1;
    const prevScale = currentScale;

    // Calcular nuevo scale
    currentScale += direction * config.zoomSpeed;
    // Limitar el scale entre min y max
    currentScale = gsap.utils.clamp(config.minScale, config.maxScale, currentScale);

    if (currentScale === prevScale) return; // Si no cambia, no hacemos nada

    // ANIMAR EL ZOOM CON GSAP
    // Usamos gsap.to para que sea suave y Draggable lo detecte automáticamente
    gsap.to(map, {
        scale: currentScale,
        duration: 0.3,
        overwrite: true,
        onUpdate: function () {
            // Mientras se hace zoom, recalculamos los límites para que no se salga
            updateBounds();

            // Truco: Si al hacer zoom out el mapa se queda fuera de los bordes,
            // GSAP Draggable necesita que le digamos que verifique los límites.
            if (!draggableInstance.isDragging) {
                // Forzamos una actualización de posición si se sale de los bordes
                const bounds = draggableInstance.vars.bounds;

                // Usamos clamp para traer la X e Y dentro de los nuevos límites permitidos
                const safeX = gsap.utils.clamp(bounds.minX, bounds.maxX, gsap.getProperty(map, "x"));
                const safeY = gsap.utils.clamp(bounds.minY, bounds.maxY, gsap.getProperty(map, "y"));

                gsap.set(map, { x: safeX, y: safeY });

                // Sincronizamos manualmente el overlay y la instancia draggable
                if (mapOverlay) gsap.set(mapOverlay, { x: safeX, y: safeY });
                draggableInstance.update();
            }
        }
    });
}

// Inicialización
gsap.set(map, { scale: currentScale, x: 0, y: 0 }); // Posición inicial
updateBounds();

// Ajustar al redimensionar ventana
window.addEventListener("resize", () => {
    updateBounds();
    draggableInstance.update(true);
});
