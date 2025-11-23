const aboutWrapper = document.querySelector('.about-wrapper')
const aboutContainer = document.querySelector('.about-info')
const aboutBtn = document.querySelector('.about-btn')

fetch('/js/about.json')
    .then((response) => response.json())
    .then((abt) => {
        console.log('about')

        aboutWrapper.innerHTML = `<p>${abt.title}</p><p class=about-container>${abt.text}</p>`

        aboutBtn.addEventListener('click', () => {
            openAbout()
        })

    })
    .catch((err) => console.error("Error cargando citas:", err));

// abrir sección about
function openAbout() {
    let tlOpenAbout = gsap.timeline()
    gsap.set(aboutContainer, {
        y: 50,
    })
    tlOpenAbout
        .to(aboutContainer, {
            y: 30,
            autoAlpha: .9,
            duration: 0.2,
        })
        .to(aboutWrapper, {
            autoAlpha: 1,
            duration: 0.3,
            ease: "power2.out",
        });
}