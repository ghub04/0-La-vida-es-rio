document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(DrawSVGPlugin);

    const loader = document.querySelector("#loader");
    const infoWrapper = document.querySelector(".info-wrapper");
    const mapSvg = document.querySelector(".loader-container");
    const mapPath = document.querySelector(".loader-container .loader-path");
    const border = document.querySelector('.border-container')
    const waves = document.querySelector('.waves')

    // 1) Mostrar el SVG (estaba a opacity 0)
    // gsap.to(mapSvg, {
    //     autoAlpha: 1,
    //     duration: 0.5,
    //     delay: 0.3
    // });

    // 2) Preparar el trazo del mapa
    gsap.set(mapPath, {
        drawSVG: "0%"
    });

    // 3) Animar el trazado
    gsap.to(mapPath, {
        autoAlpha: 1,
        drawSVG: "100%",
        duration: 3,
        ease: "power2.out",
        delay: 0.5,
        onComplete: () => {
            // 4) Fade out del loader
            loader.classList.add("fade-out");

            // 5) Mostrar el infoWrapper
            gsap.to(infoWrapper, {
                autoAlpha: 1,
                duration: 1,
                ease: "power2.out",
                delay: 0.2
            });
        }
    });

    function loaderWaves() {
        gsap.fromTo(waves,
            {
                scale: 0.6,
                opacity: 0.9
            },
            {
                scale: 2.4,
                opacity: 0,
                duration: 1.6,
                ease: "power1.out",
                repeat: -1
            }
        );
    }
    loaderWaves()



    // gsap ends
});
