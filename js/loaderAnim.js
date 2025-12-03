document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(DrawSVGPlugin);

    const loader = document.querySelector("#loader")
    const infoWrapper = document.querySelector(".info-wrapper")
    // const mapSvg = document.querySelector(".loader-container");
    const svgPath = document.querySelector(".loader-container .loader-path")
    const border = document.querySelector('.border-container')
    const waves = document.querySelector('.waves')
    const info = document.querySelector('.info-about')
    const cover = document.querySelector(".cover");
    const closeCover = document.querySelector('#close-cover')

    // AUDIO
    const audio = new Audio('assets/forest-wind.mp3')
    const audioToggle = document.querySelector('.audio-btn')
    audio.loop = true


    const titleContainer = document.querySelector('.title')
    const titleH1 = document.querySelector('.title h1')

    let tlCover = gsap.timeline()


    // 2) Preparar el trazo del mapa
    gsap.set(svgPath, {
        drawSVG: "0%"
    });



    // 3) Animar el trazado
    tlCover.to(svgPath, {
        autoAlpha: 1,
        drawSVG: "100%",
        duration: 3,
        ease: "power2.out",
        delay: 2,
        onComplete: () => {
            // 4) Fade out del loader
            loader.classList.add("fade-out");
        }
    })
        .call(textAnimation, null, '-=0.5')

        // 5) Mostrar el infoWrapper
        .to(infoWrapper, {
            y: 10,
            autoAlpha: 1,
            duration: 1,
            ease: "power2.out",
            delay: 0.2,

        }).call(splitInfoAnim, null, '-=1')
        .call(closeCoverAnim, null, '+=0.2')

    // anim waves
    function loaderWaves() {
        gsap.fromTo(waves,
            {
                scale: 0.6,
                autoAlpha: 0.9
            },
            {
                scale: 2.4,
                autoAlpha: 0,
                duration: 2,
                ease: "power1.out",
                repeat: -1
            }
        );
    }
    loaderWaves()

    //close Cover
    function closeCoverAnim() {

        gsap.set(closeCover, {
            y: 0,
            autoAlpha: 1,
        });

        function hideCover() {
            gsap.to(cover, {
                autoAlpha: 0,
                duration: 0.5,
            });
        }

        closeCover.addEventListener("click", () => {
            hideCover();

        });
    }
    // closeCoverAnim()


    // info text anim
    function splitInfoAnim() {
        let splitinfo = SplitText.create(info, {
            type: "words",
        });

        let infoWords = splitinfo.words
        gsap.set(infoWords, {
            autoAlpha: .3,
        });
        gsap.to(infoWords, {
            autoAlpha: 1,
            duration: 2,
            stagger: 0.05,
        });
    }

    // TITULO ANIM
    const displacementMap = document.querySelector('#wavy feTurbulence');


    gsap.set(displacementMap, {
        attr: { baseFrequency: 0.003 } // Valor inicial 
    });


    gsap.set(titleContainer, {
        autoAlpha: 0,
        y: 30
    });

    function textAnimation() {
        document.fonts.ready.then(() => {


            let split = SplitText.create(titleH1, {
                type: "chars, words",

                charsClass: "char-split"
            });


            titleH1.offsetHeight;

            let tl = gsap.timeline();
            let words = split.words;

            tl.to(titleH1, {
                // y: 0,
                autoAlpha: 1,
                duration: 0.1
            })
                .to(titleContainer, {
                    // y: 0,
                    autoAlpha: 1,
                    duration: 3,
                    ease: "power2.out",
                })
                // .from(words, {
                //     y: 100,
                //     duration: 3,
                //     stagger: 0.05,
                //     ease: "power2.out"
                // }, '<')

                .to(displacementMap, {
                    attr: { baseFrequency: 0.006 },
                    duration: 20,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                }, '<');
        });
    }
    // -----



    // gsap ends
});
