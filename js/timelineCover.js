
document.addEventListener("DOMContentLoaded", () => {
    console.log('init timeline cover')

    const msg = document.querySelectorAll('.cover-info p')
    const cover = document.querySelector('.cover')

    let tlCover = gsap.timeline()
    let split

    function textAnimation() {
        document.fonts.ready.then(() => {
            split = SplitText.create('.title', {
                type: 'words'
            })

            gsap.from(split.words, {
                y: 100,
                autoAlpha: 0,
                stagger: 0.05,
                duration: 3,
                delay: 6,
                ease: 'power2.out',
            })
        })
    }

    tlCover.fromTo('.loader', {
        x: '-100%'
    }, {
        x: 0,
        duration: 5,
        ease: 'power2.inOut',
    }).to('.loader', {
        autoAlpha: 0,
        duration: 0.3
    }).add(textAnimation())
        .add(coverInfo())


    gsap.set(msg, {
        autoAlpha: 0,
        y: 10
    })

    function coverInfo() {
        let tlCoverInfo = gsap.timeline()

        msg.forEach((p, i) => {
            tlCoverInfo.to(p, {
                // paused: true,
                autoAlpha: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out',
                onComplete: () => { hideCover() }
            })
        })
        return tlCoverInfo
    }

    function hideCover() {
        gsap.to(cover, {
            autoAlpha: 0,
            duration: 2
        })
    }









    // gsap ends
})