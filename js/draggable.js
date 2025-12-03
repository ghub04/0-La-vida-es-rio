
// gsap.registerPlugin(Draggable);

// const map = document.querySelector('#map');
// const mapOverlay = document.querySelector('.map-overlay');

// // Configuración
// let scale = 2;
// const minScale = 1;
// const maxScale = 2;
// const zoomSpeed = 0.2;

// // si ha habido click o arrastre
// export let moved = false;

// // draggable
// const draggableInstance = Draggable.create(map, {
//     type: "x,y",
//     edgeResistance: 0.65,
//     inertia: true,


//     onDrag: syncOverlay,
//     onThrowUpdate: syncOverlay,


//     onPress: () => { moved = false; },
//     onDragStart: () => { moved = true; }
// })[0];

// // overlay
// function syncOverlay() {
//     if (mapOverlay) {
//         // Copiamos la X e Y del mapa al overlay
//         gsap.set(mapOverlay, { x: this.x, y: this.y });
//     }
// }


// // limites
// function updateBounds() {
//     const containerWidth = window.innerWidth;
//     const containerHeight = window.innerHeight;


//     const scaledWidth = containerWidth * scale;
//     const scaledHeight = containerHeight * scale;

//     // cálculo de los límites
//     let limitX = (scaledWidth - containerWidth) / 2;
//     let limitY = (scaledHeight - containerHeight) / 2;


//     if (scaledWidth < containerWidth) limitX = 0;
//     if (scaledHeight < containerHeight) limitY = 0;

//     // Aplica límites al Draggable
//     draggableInstance.applyBounds({
//         minX: -limitX,
//         maxX: limitX,
//         minY: -limitY,
//         maxY: limitY
//     });
// }


// // zoom

// window.addEventListener("wheel", onZoom, { passive: false });

// function onZoom(e) {

//     if (!e.target.closest('#map-container')) return;

//     e.preventDefault();

//     const direction = e.deltaY > 0 ? -1 : 1;
//     const prevScale = scale;

//     // Calcular nuevo scale
//     scale += direction * zoomSpeed;
//     scale = gsap.utils.clamp(minScale, maxScale, scale);

//     if (scale === prevScale) return;

//     gsap.to(map, {
//         scale: scale,
//         duration: 0.3,
//         overwrite: true,
//         ease: "power1.out",
//         onUpdate: () => {

//             updateBounds();


//             if (draggableInstance.isPressed) return;


//             const bounds = draggableInstance.vars.bounds;

//             gsap.to(map, {
//                 x: gsap.utils.clamp(draggableInstance.minX, draggableInstance.maxX, draggableInstance.x),
//                 y: gsap.utils.clamp(draggableInstance.minY, draggableInstance.maxY, draggableInstance.y),
//                 duration: 0.1,
//                 overwrite: "auto",
//                 onUpdate: () => syncOverlay.call(draggableInstance) // Sincronizar overlay
//             });
//         }
//     });

//     // Actualizamos límites finales
//     updateBounds();
// }

// // Resize
// // escala inicial
// gsap.set(map, { scale: scale });
// updateBounds();

// window.addEventListener("resize", () => {
//     updateBounds();
//     draggableInstance.update(true);
// });

// NUEVO CODIGO
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