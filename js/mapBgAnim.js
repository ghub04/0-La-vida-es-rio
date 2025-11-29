document.addEventListener("DOMContentLoaded", () => {

    console.log('ocean filter anim')

    const turbulence = document.querySelector('#ocean-texture feTurbulence');

    gsap.to(turbulence, {
        attr: { baseFrequency: 0.72 },
        duration: 15,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });






    // gsap ends
})