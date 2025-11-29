const aboutWrapper = document.querySelector('.about-wrapper')
// const aboutContainer = document.querySelector('.about-info')
let aboutContainer
const aboutBtn = document.querySelector('.about-btn')
const closeBtn = document.querySelector(".close");


fetch('js/json/about.json')
    .then((response) => response.json())
    .then((abt) => {
        // console.log('about')

        aboutWrapper.innerHTML = `<div class=about-container><p>${abt.title}</p><p>${abt.text}</p></div>`

        aboutContainer = document.querySelector('.about-container')

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
        }).to(closeBtn, {
            autoAlpha: 1,
            duration: .3,
        });
}


