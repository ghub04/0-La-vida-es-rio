
// gsap.registerPlugin(Draggable);
// console.log('draggable')
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



// import { gsap } from "gsap";
// import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

const map = document.querySelector('#map');
const mapOverlay = document.querySelector('.map-overlay');

// Configuración
let scale = 2; // Asegúrate de que este valor coincida con tu CSS inicial si lo hay
const config = {
    minScale: 1,
    maxScale: 3,
    zoomSpeed: 0.2
};

export let moved = false;

// 1. DRAGGABLE
// ------------------------------
const draggableInstance = Draggable.create(map, {
    type: "x,y",
    edgeResistance: 0.65,
    inertia: true,

    // Importante: Al arrastrar, actualizamos el overlay
    onDrag: updateOverlay,
    onThrowUpdate: updateOverlay,

    onPress: () => { moved = false; },
    onDragStart: () => { moved = true; }
})[0];

function updateOverlay() {
    if (mapOverlay) {
        // 'this' es la instancia de Draggable
        gsap.set(mapOverlay, { x: this.x, y: this.y });
    }
}

// 2. LÍMITES (BOUNDS)
// ------------------------------
function updateBounds() {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    // Calculamos dimensiones con el scale actual
    const scaledWidth = containerWidth * scale;
    const scaledHeight = containerHeight * scale;

    // Calculamos el desbordamiento
    // Si scale = 1, el desbordamiento es 0.
    const xOverflow = (scaledWidth - containerWidth);
    const yOverflow = (scaledHeight - containerHeight);

    // Los límites son la mitad del desbordamiento hacia cada lado
    // Si no hay desbordamiento, es 0.
    const minX = xOverflow > 0 ? -xOverflow / 2 : 0;
    const maxX = xOverflow > 0 ? xOverflow / 2 : 0;
    const minY = yOverflow > 0 ? -yOverflow / 2 : 0;
    const maxY = yOverflow > 0 ? yOverflow / 2 : 0;

    // Aplicamos límites al Draggable
    draggableInstance.applyBounds({ minX, maxX, minY, maxY });
}

// 3. ZOOM
// ------------------------------
window.addEventListener("wheel", onZoom, { passive: false });

function onZoom(e) {
    // CORRECCIÓN 1: Selector más permisivo. 
    // Si haces scroll sobre el mapa O el overlay, funciona.
    if (!e.target.closest('#map') && !e.target.closest('.map-overlay')) return;

    e.preventDefault();

    const direction = e.deltaY > 0 ? -1 : 1;
    const prevScale = scale;

    // Calcular nuevo scale
    scale += direction * config.zoomSpeed;
    scale = gsap.utils.clamp(config.minScale, config.maxScale, scale);

    if (scale === prevScale) return;

    // Actualizamos los límites de Draggable AHORA con la nueva escala
    updateBounds();

    // CORRECCIÓN 2: Calcular la posición corregida ANTES de animar
    // Obtenemos la posición actual X/Y del mapa
    const currentX = gsap.getProperty(map, "x");
    const currentY = gsap.getProperty(map, "y");

    // "Clampeamos" esa posición a los NUEVOS límites que acabamos de calcular
    // Esto asegura que al hacer zoom out, el mapa no se quede fuera.
    const targetX = gsap.utils.clamp(draggableInstance.minX, draggableInstance.maxX, currentX);
    const targetY = gsap.utils.clamp(draggableInstance.minY, draggableInstance.maxY, currentY);

    // Animamos TODO junto (Scale y X/Y) para evitar conflictos
    gsap.to(map, {
        scale: scale,
        x: targetX,
        y: targetY,
        duration: 0.3,
        overwrite: true,
        ease: "power1.out",
        onUpdate: () => {
            // Sincronizamos el overlay visualmente durante la animación
            if (mapOverlay) gsap.set(mapOverlay, { x: targetX, y: targetY });

            // CORRECCIÓN 3: Avisar a Draggable de que estamos moviendo el mapa externamente
            draggableInstance.update(true);
        },
        onComplete: () => {
            // Aseguramos sincronización final perfecta
            draggableInstance.update(true);
        }
    });
}

// 4. INICIALIZACIÓN
// ------------------------------
// Seteamos valores iniciales
gsap.set(map, { scale: scale, x: 0, y: 0 });
updateBounds();

window.addEventListener("resize", () => {
    updateBounds();
    draggableInstance.update(true);
});