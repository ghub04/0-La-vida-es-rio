document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(DrawSVGPlugin);

    const loader = document.querySelector("#loader")
    const infoWrapper = document.querySelector(".info-wrapper")
    // const mapSvg = document.querySelector(".loader-container");
    const svgPath = document.querySelector(".loader-container .loader-path")
    const border = document.querySelector('.border-container')
    const waves = document.querySelector('.waves')
    const info = document.querySelector('.info-about')

    const titleContainer = document.querySelector('.title')
    const titleH1 = document.querySelector('.title h1')

    let tlCover = gsap.timeline()

    // 1) Mostrar el SVG (estaba a opacity 0)
    // gsap.to(mapSvg, {
    //     autoAlpha: 1,
    //     duration: 0.5,
    //     delay: 0.3
    // });


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
        delay: 0.5,
        onComplete: () => {
            // 4) Fade out del loader
            loader.classList.add("fade-out");
        }
    }).call(textAnimation)

        // 5) Mostrar el infoWrapper
        .to(infoWrapper, {
            y: 10,
            autoAlpha: 1,
            duration: 1,
            ease: "power2.out",
            delay: 0.2,

        });

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
                duration: 1.6,
                ease: "power1.out",
                repeat: -1
            }
        );
    }
    loaderWaves()


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

    //la vida es rio anim
    // ANIMACION TITLE
    // gsap.set(titleContainer, {
    //     autoAlpha: 0,
    //     y: '30'
    // })

    // const f = document.querySelector('#wavy feTurbulence');
    // function textAnimation() {
    //     console.log('title')
    //     document.fonts.ready.then(() => {
    //         requestAnimationFrame(() => {
    //             f.baseFrequency += '0.005';
    //         });

    //         titleH1.offsetHeight;
    //         setTimeout(() => {


    //             let split = SplitText.create(titleH1, {
    //                 type: "chars, words",
    //             });
    //             let textAnimation = gsap.timeline();
    //             let words = split.words

    //             textAnimation.to(titleH1, {
    //                 delay: 1,
    //                 y: 0,
    //                 autoAlpha: 1,
    //             })
    //                 .to(titleContainer, {
    //                     y: 0,
    //                     autoAlpha: 1,
    //                     duration: 3,
    //                     ease: "power2.out",
    //                 }).from(words, {
    //                     y: 100,
    //                     duration: 3,
    //                     stagger: 0.05,
    //                 }, '<')
    //                 .to(f,
    //                     {
    //                         attr: { baseFrequency: "0.006" },
    //                         duration: 20,
    //                         stagger: 0.5,
    //                         repeat: -1,
    //                         yoyo: true,
    //                     },
    //                     "<"
    //                 );
    //         }, 50)
    //     });
    // }
    // -------

    // 
    const displacementMap = document.querySelector('#wavy feTurbulence');

    // 
    gsap.set(displacementMap, {
        attr: { baseFrequency: 0.005 } // Valor inicial bajo pero válido
    });

    // 
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
                y: 0,
                autoAlpha: 1,
                duration: 0.1
            })
                .to(titleContainer, {
                    y: 0,
                    autoAlpha: 1,
                    duration: 3,
                    ease: "power2.out",
                })
                .from(words, {
                    y: 100,
                    duration: 3,
                    stagger: 0.05,
                    ease: "power2.out"
                }, '<')

                .to(displacementMap, {
                    attr: { baseFrequency: 0.006 },
                    duration: 20,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                }, '<');
        });
    }




    // gsap ends
});
