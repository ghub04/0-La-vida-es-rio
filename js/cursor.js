const cursor = document.querySelector('.cursor')
const cursorPos = { x: 0, y: 0 };
const cursorEased = { x: 0, y: 0 };

export function customCursor() {
    document.addEventListener("mousemove", (e) => {
        cursorPos.x = e.clientX;
        cursorPos.y = e.clientY;

        function loop() {
            const easing = 8;
            cursorEased.x += (cursorPos.x - cursorEased.x) / easing;
            cursorEased.y += (cursorPos.y - cursorEased.y) / easing;

            cursor.style.transform = `translate(${cursorEased.x}px, ${cursorEased.y}px)`;

            requestAnimationFrame(loop)
        }
        loop()
    });
}
