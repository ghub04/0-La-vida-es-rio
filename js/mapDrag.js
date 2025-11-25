const map = document.getElementById("map");

let isDragging = false;
let startX, startY;
let currentX = 0, currentY = 0;
export let moved = false;

// wheel zoom
let scale = 3;               // escala inicial
const minScale = 1;          // límite mínimo
const maxScale = 6;          // límite máximo
const zoomSpeed = 0.2;       // sensibilidad


map.addEventListener("mousedown", startDrag);
map.addEventListener("touchstart", startDrag, { passive: false });

map.addEventListener("mousemove", drag);
map.addEventListener("touchmove", drag, { passive: false });

map.addEventListener("mouseup", endDrag);
map.addEventListener("mouseleave", endDrag);
map.addEventListener("touchend", endDrag);

function startDrag(e) {
    isDragging = true;
    moved = false; // <--- reset al empezar

    const point = e.touches ? e.touches[0] : e;

    startX = point.clientX - currentX;
    startY = point.clientY - currentY;
}

function drag(e) {
    if (!isDragging) return;

    e.preventDefault();
    const point = e.touches ? e.touches[0] : e;

    const newX = point.clientX - startX;
    const newY = point.clientY - startY;

    // Detectamos que se ha movido más de 3px → consideramos drag
    if (Math.abs(newX - currentX) > 3 || Math.abs(newY - currentY) > 3) {
        moved = true;
    }

    currentX = newX;
    currentY = newY;

    map.style.transform = `translate(${currentX}px, ${currentY}px) scale(3)`;
}

function endDrag(e) {
    // Si se movió → bloqueamos el click automático
    if (moved) {
        e.stopPropagation();
        e.preventDefault();
    }
    isDragging = false;
}


// wheel zoom
map.addEventListener("wheel", onZoom, { passive: false });

function onZoom(e) {
    e.preventDefault();

    // deltaY > 0 → scroll down → alejar
    // deltaY < 0 → scroll up → acercar
    const direction = e.deltaY > 0 ? -1 : 1;

    // nueva escala
    const newScale = scale + direction * zoomSpeed;

    // límites
    scale = Math.min(maxScale, Math.max(minScale, newScale));

    // aplicar zoom manteniendo posición actual del drag
    map.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
}

