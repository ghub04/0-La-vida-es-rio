
gsap.set(".cursor", { xPercent: -50, yPercent: -50 });

const xSet = gsap.quickSetter(".cursor", "x", "px");
const ySet = gsap.quickSetter(".cursor", "y", "px");

window.addEventListener("mousemove", e => {
    xSet(e.x);
    ySet(e.y);
});
