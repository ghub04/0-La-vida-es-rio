document.addEventListener("DOMContentLoaded", () => {
  // console.log("init timeline cover");
  gsap.registerPlugin(SplitText);

  const cover = document.querySelector(".cover");
  const msg = document.querySelector("#info-1");
  const closeCover = document.querySelector("#info-2");

  let tlCover = gsap.timeline();
  let split;

  // animacion la vida es rio
  function textAnimation() {
    document.fonts.ready.then(() => {
      split = SplitText.create(".title", {
        type: "words",
      });

      gsap.from(split.words, {
        y: 100,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 3,
        delay: 6,
        ease: "power2.out",
      });
    });
  }

  // loading-bar
  tlCover
    .fromTo(
      ".loader",
      {
        x: "-100%",
      },
      {
        x: 0,
        duration: 5,
        ease: "power2.inOut",
      }
    )
    .to(".loader", {
      autoAlpha: 0,
      duration: 0.3,
    })
    .add(textAnimation())
    .add(coverInfo());

  // mensaje mientras carga
  gsap.set(msg, {
    y: -90,
    autoAlpha: 0,
  });

  gsap.set(closeCover, {
    y: 0,
    autoAlpha: 0,
  });

  function coverInfo() {
    let tlCoverInfo = gsap.timeline();
    tlCoverInfo
      .to(msg, {
        y: -100,
        autoAlpha: 1,
        duration: 1,
        delay: 3,
      })
      .to(msg, {
        autoAlpha: 0,
        duration: 1,
        delay: 2,
      })
      .to(closeCover, {
        autoAlpha: 1,
        duration: 1,
        delay: 1.5,
      });
  }
  coverInfo();

  // ocultar cover una vez completada la carga
  function hideCover() {
    gsap.to(cover, {
      autoAlpha: 0,
      duration: 0.5,
    });
  }

  closeCover.addEventListener("click", () => {
    // console.log("close");
    hideCover();
  });

  // movimiento del mar
  let oceanMove = gsap.timeline();
  oceanMove.to("#erode feMorphology", {
    attr: { radius: 5 },
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });

  // gsap ends
});
