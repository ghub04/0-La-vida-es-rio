document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(DrawSVGPlugin);

    const loader = document.querySelector("#loader");
    const cover = document.querySelector(".info-wrapper");
    const mapSvg = document.querySelector(".loader-container");
    const mapPath = document.querySelector(".loader-container .loader-path");

    // 1) Mostrar el SVG (estaba a opacity 0)
    gsap.to(mapSvg, {
        autoAlpha: 1,
        duration: 0.5,
        delay: 0.3
    });

    // 2) Preparar el trazo del mapa
    gsap.set(mapPath, { drawSVG: "0%" });

    // 3) Animar el trazado
    gsap.to(mapPath, {
        drawSVG: "100%",
        duration: 3,
        ease: "power2.out",
        delay: 0.5,
        onComplete: () => {
            // 4) Fade out del loader
            loader.classList.add("fade-out");

            // 5) Mostrar el cover
            gsap.to(cover, {
                autoAlpha: 1,
                duration: 1,
                ease: "power2.out",
                delay: 0.2
            });
        }
    });
});
