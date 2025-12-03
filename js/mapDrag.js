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

