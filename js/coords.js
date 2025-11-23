const location = document.querySelectorAll('.circle')

gsap.set(location, {
  scale: 1,
  transformOrigin: "50% 50%",
})

location.forEach((loc, i) => {
  gsap.to(loc, {
    scale: 1.5,
    repeat: -1,
    yoyo: true,
    duration: 1,
    delay: i * .2,
  })
})
