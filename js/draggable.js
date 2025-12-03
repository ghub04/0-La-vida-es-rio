// import { gsap } from "gsap";
// import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);
gsap.registerPlugin(InertiaPlugin)

const map = document.querySelector('#map');
const mapOverlay = document.querySelector('.map-overlay');

// inicial
let scale = 2;
const config = {
    minScale: 1,
    maxScale: 3,
    zoomSpeed: 0.2
};

export let moved = false;


const draggableInstance = Draggable.create(map, {
    type: "x,y",
    edgeResistance: 0.65,


    inertia: true,
    resistance: 3000,

    overshootTolerance: 0,

    onDrag: updateOverlay,
    onThrowUpdate: updateOverlay,

    onPress: () => { moved = false; },
    onDragStart: () => { moved = true; }
})[0];

function updateOverlay() {
    if (mapOverlay) {

        gsap.set(mapOverlay, { x: this.x, y: this.y });
    }
}

// limites
function updateBounds() {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    const scaledWidth = containerWidth * scale;
    const scaledHeight = containerHeight * scale;

    const xOverflow = (scaledWidth - containerWidth);
    const yOverflow = (scaledHeight - containerHeight);

    const minX = xOverflow > 0 ? -xOverflow / 2 : 0;
    const maxX = xOverflow > 0 ? xOverflow / 2 : 0;
    const minY = yOverflow > 0 ? -yOverflow / 2 : 0;
    const maxY = yOverflow > 0 ? yOverflow / 2 : 0;

    draggableInstance.applyBounds({ minX, maxX, minY, maxY });
}

//zoom
window.addEventListener("wheel", onZoom, { passive: false });

function onZoom(e) {

    if (!e.target.closest('#map') && !e.target.closest('.map-overlay')) return;

    e.preventDefault();

    const direction = e.deltaY > 0 ? -1 : 1;
    const prevScale = scale;

    scale += direction * config.zoomSpeed;
    scale = gsap.utils.clamp(config.minScale, config.maxScale, scale);

    if (scale === prevScale) return;

    updateBounds();

    const currentX = gsap.getProperty(map, "x");
    const currentY = gsap.getProperty(map, "y");

    const targetX = gsap.utils.clamp(draggableInstance.minX, draggableInstance.maxX, currentX);
    const targetY = gsap.utils.clamp(draggableInstance.minY, draggableInstance.maxY, currentY);

    gsap.to(map, {
        scale: scale,
        x: targetX,
        y: targetY,
        duration: 0.3,
        overwrite: true,
        ease: "power1.out",
        onUpdate: () => {

            if (mapOverlay) gsap.set(mapOverlay, { x: targetX, y: targetY });

            draggableInstance.update(true);
        },
        onComplete: () => {

            draggableInstance.update(true);
        }
    });
}

// inicializa
gsap.set(map, { scale: scale, x: 0, y: 0 });
updateBounds();

window.addEventListener("resize", () => {
    updateBounds();
    draggableInstance.update(true);
});