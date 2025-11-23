const location=document.querySelectorAll('.circle')
console.log('coords')

gsap.set(location,{
scale:1,
transformOrigin:"50% 50%",
})

gsap.to(location,{
  scale:1.2,
  repeat:-1,
  yoyo:true,
  duration:1,
})
