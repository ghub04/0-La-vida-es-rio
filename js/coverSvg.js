document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(DrawSVGPlugin)
    console.log('draw-svg')

    const river = document.querySelector('#svg-river path')

    let tlSvg = gsap.timeline()

    gsap.set(river, {
        drawSVG: '0'
    })

    tlSvg.to(river, {
        drawSVG: '0% 50%',
        duration: 10,
    })

    // gsap code here!
});