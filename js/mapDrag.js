const map = document.getElementById("map");

let isDragging = false;
let startX = 0;
let startY = 0;

let offsetX = 0;
let offsetY = 0;

let scale = 2;
const minScale = 1;
const maxScale = 6;
const zoomSpeed = 0.2;

export let moved = false;

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

    // si hubo movimiento
    if (Math.abs(newX - offsetX) > 3 || Math.abs(newY - offsetY) > 3) {
        moved = true;
    }

    offsetX = newX;
    offsetY = newY;

    applyTransform();
}

function endDrag(e) {
    if (moved) {
        e.stopPropagation();
        e.preventDefault();
    }
    isDragging = false;
}

// zoom
map.addEventListener("wheel", onZoom, { passive: false });

function onZoom(e) {
    e.preventDefault();

    const direction = e.deltaY > 0 ? -1 : 1;

    scale += direction * zoomSpeed;
    scale = Math.max(minScale, Math.min(maxScale, scale));

    applyTransform();
}

// render
function applyTransform() {
    map.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}
