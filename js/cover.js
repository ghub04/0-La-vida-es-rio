// console.log('gsap init')
gsap.registerPlugin(SplitText)

export function textAnimation() {

    document.fonts.ready.then(() => {
        let split = SplitText.create('.title', {
            type: 'chars'
        })

        gsap.from(split.chars, {
            y: 100,
            repeat: -1,
            yoyo: true,

            autoAlpha: 0,
            stagger: 0.05,
            duration: 2
        })
    })
}
