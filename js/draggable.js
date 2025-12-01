// import { gsap } from "/gsap";
// import { Draggable } from "gsap/Draggable";

// Asegúrate de registrar el plugin
gsap.registerPlugin(Draggable);

const map = document.querySelector('#map');
const mapOverlay = document.querySelector('.map-overlay');

// Configuración
let scale = 2;
const minScale = 1;
const maxScale = 2;
const zoomSpeed = 0.2;

// Variable exportada para detectar si ha sido click o arrastre (para tus enlaces internos)
export let moved = false;

// 1. Inicializar Draggable
// ----------------------------------------------------------------
const draggableInstance = Draggable.create(map, {
    type: "x,y", // Mucho más rápido que top/left
    edgeResistance: 0.65, // Sensación de "tope" al llegar al borde
    inertia: true, // Requiere InertiaPlugin (si no lo tienes, bórralo, pero mejora mucho la UX)

    // Sincronizamos el overlay mientras arrastramos
    onDrag: syncOverlay,
    onThrowUpdate: syncOverlay, // Necesario si usas inercia

    // Gestión de la variable 'moved' para diferenciar click de drag
    onPress: () => { moved = false; },
    onDragStart: () => { moved = true; }
})[0]; // Draggable.create devuelve un array, cogemos el primero.


// 2. Función para Sincronizar el Overlay
// ----------------------------------------------------------------
// Usamos gsap.set para máximo rendimiento (no anima, solo coloca)
function syncOverlay() {
    if (mapOverlay) {
        // Copiamos la X e Y del mapa al overlay
        gsap.set(mapOverlay, { x: this.x, y: this.y });
    }
}


// 3. Cálculo de Límites (Bounds)
// ----------------------------------------------------------------
function updateBounds() {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    // Dimensiones actuales escaladas
    const scaledWidth = containerWidth * scale;
    const scaledHeight = containerHeight * scale;

    // Calculamos los límites igual que en tu lógica original
    // (Asumiendo que transform-origin es center center)
    let limitX = (scaledWidth - containerWidth) / 2;
    let limitY = (scaledHeight - containerHeight) / 2;

    // Si el mapa es menor que la pantalla, limitX/Y serán negativos o cero,
    // queremos centrarlo o bloquearlo en 0.
    if (scaledWidth < containerWidth) limitX = 0;
    if (scaledHeight < containerHeight) limitY = 0;

    // Aplicamos los límites al Draggable
    draggableInstance.applyBounds({
        minX: -limitX,
        maxX: limitX,
        minY: -limitY,
        maxY: limitY
    });
}


// 4. Lógica de Zoom Optimizada
// ----------------------------------------------------------------
// Usamos un listener pasivo false para poder hacer preventDefault
window.addEventListener("wheel", onZoom, { passive: false });

function onZoom(e) {
    // Solo hacemos zoom si el evento ocurre sobre el mapa o contenedor
    if (!e.target.closest('#map-container')) return;

    e.preventDefault();

    const direction = e.deltaY > 0 ? -1 : 1;
    const prevScale = scale;

    // Calcular nuevo scale
    scale += direction * zoomSpeed;
    scale = gsap.utils.clamp(minScale, maxScale, scale); // Utilidad de GSAP para limitar rangos

    if (scale === prevScale) return; // Si no hay cambio, no hacemos nada

    // 1. Animamos el escalado del mapa (suave)
    gsap.to(map, {
        scale: scale,
        duration: 0.3,
        overwrite: true, // Importante: sobreescribe animaciones previas para evitar conflictos
        ease: "power1.out",
        onUpdate: () => {
            // Mientras escala, necesitamos asegurarnos de que no se salga de los bordes
            // si el usuario estaba en una esquina y hace zoom out.
            updateBounds();

            // Forzamos al draggable a comprobar si se ha salido de los nuevos límites
            if (draggableInstance.isPressed) return; // No corregir si el usuario está arrastrando

            // Comprobación manual simple para "rebotar" si se sale al hacer zoom out
            const bounds = draggableInstance.vars.bounds;
            // Nota: acceder a vars.bounds requiere que hayamos llamado a applyBounds antes

            // Esta parte deja que GSAP maneje la posición x/y, 
            // pero si quieres que al hacer zoom out el mapa vuelva al centro si se sale:
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

// 5. Inicialización y Resize
// ----------------------------------------------------------------
// Establecemos escala inicial
gsap.set(map, { scale: scale });
updateBounds();

// Recalcular límites si se redimensiona la ventana
window.addEventListener("resize", () => {
    updateBounds();
    draggableInstance.update(true); // Refresca cálculos internos de Draggable
});