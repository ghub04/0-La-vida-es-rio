// console.log('gsap init')
gsap.registerPlugin(SplitText)

const loader = document.querySelector('.loader');
const progress = document.querySelector('.progress');
const cover = document.querySelector('.cover')

export function textAnimation() {

    document.fonts.ready.then(() => {
        let split = SplitText.create('.title', {
            type: 'words'
        })

        gsap.from(split.words, {
            y: 100,
            // repeat: -1,
            // yoyo: true,

            autoAlpha: 0,
            stagger: 0.05,
            duration: 2
        })
    })
}

// loader starts
export function loadingBar() {
    function hideCover() {
        gsap.to(cover, {
            autoAlpha: 0,
            duration: 2
        })
    }
    let load = 0;
    const loadingInterval = setInterval(() => {
        // barra de progreso
        load += 10;
        progress.style.width = load + '%';

        if (load >= 100) {
            clearInterval(loadingInterval);

            // Desaparece loader
            gsap.to(loader, {
                autoAlpha: 0,
                duration: 0.5,
                // onComplete: () => hideCover()
            });

        }
    }, 200);
}
// loader ends