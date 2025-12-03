// puntos
const location = document.querySelectorAll('.circle')

gsap.set(location, {
  scale: 1,
  transformOrigin: "50% 50%",
})

location.forEach((loc, i) => {
  gsap.to(loc, {
    scale: 1.2,
    repeat: -1,
    yoyo: true,
    duration: 1,
    delay: i * .2,
  })
})

// orilla

const shoreWaves = document.querySelector('.shore')

let tlShore = gsap.timeline()

tlShore.to(shoreWaves, {
  autoAlpha: .2,
  repeat: -1,
  yoyo: true,
  duration: 4,
})
