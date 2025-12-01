
gsap.registerPlugin(Draggable);

const map = document.querySelector('#map');
const mapOverlay = document.querySelector('.map-overlay');

// Configuración
let scale = 2;
const minScale = 1;
const maxScale = 2;
const zoomSpeed = 0.2;

// si ha habido click o arrastre
export let moved = false;

// draggable
const draggableInstance = Draggable.create(map, {
    type: "x,y",
    edgeResistance: 0.65,
    inertia: true,


    onDrag: syncOverlay,
    onThrowUpdate: syncOverlay,


    onPress: () => { moved = false; },
    onDragStart: () => { moved = true; }
})[0];

// overlay
function syncOverlay() {
    if (mapOverlay) {
        // Copiamos la X e Y del mapa al overlay
        gsap.set(mapOverlay, { x: this.x, y: this.y });
    }
}


// limites
function updateBounds() {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;


    const scaledWidth = containerWidth * scale;
    const scaledHeight = containerHeight * scale;

    // cálculo de los límites
    let limitX = (scaledWidth - containerWidth) / 2;
    let limitY = (scaledHeight - containerHeight) / 2;


    if (scaledWidth < containerWidth) limitX = 0;
    if (scaledHeight < containerHeight) limitY = 0;

    // Aplica límites al Draggable
    draggableInstance.applyBounds({
        minX: -limitX,
        maxX: limitX,
        minY: -limitY,
        maxY: limitY
    });
}


// zoom

window.addEventListener("wheel", onZoom, { passive: false });

function onZoom(e) {

    if (!e.target.closest('#map-container')) return;

    e.preventDefault();

    const direction = e.deltaY > 0 ? -1 : 1;
    const prevScale = scale;

    // Calcular nuevo scale
    scale += direction * zoomSpeed;
    scale = gsap.utils.clamp(minScale, maxScale, scale);

    if (scale === prevScale) return;

    gsap.to(map, {
        scale: scale,
        duration: 0.3,
        overwrite: true,
        ease: "power1.out",
        onUpdate: () => {

            updateBounds();


            if (draggableInstance.isPressed) return;


            const bounds = draggableInstance.vars.bounds;

            gsap.to(map, {
                x: gsap.utils.clamp(draggableInstance.minX, draggableInstance.maxX, draggableInstance.x),
                y: gsap.utils.clamp(draggableInstance.minY, draggableInstance.maxY, draggableInstance.y),
                duration: 0.1,
                overwrite: "auto",
                onUpdate: () => syncOverlay.call(draggableInstance) // Sincronizar overlay
            });
        }
    });

    // Actualizamos límites finales
    updateBounds();
}

// Resize
// escala inicial
gsap.set(map, { scale: scale });
updateBounds();

window.addEventListener("resize", () => {
    updateBounds();
    draggableInstance.update(true);
});

