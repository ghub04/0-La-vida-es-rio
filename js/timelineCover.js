export let isAudioOn = false

export function getAudio() {
  return isAudioOn
}

document.addEventListener("DOMContentLoaded", () => {
  // console.log("init timeline cover");
  gsap.registerPlugin(SplitText);

  const borders = document.querySelector('.border-container')

  const cover = document.querySelector(".cover");

  const closeCover = document.querySelector("#close-cover");

  const msg = document.querySelector("#info-1");

  const mapInfo = document.querySelectorAll(".map-info p");
  // TITLE
  const titleContainer = document.querySelector('.title')
  const titleH1 = document.querySelector('.title h1')

  // AUDIO
  const audio = new Audio('assets/forest-wind.mp3')
  const audioToggle = document.querySelector('.audio-btn')
  audio.loop = true

  let tlCover = gsap.timeline();
  let split;

  // animacion la vida es rio
  function textAnimation() {
    document.fonts.ready.then(() => {
      split = SplitText.create(titleH1, {
        type: "words",
      });
      let textAnimation = gsap.timeline();

      textAnimation
        .from(titleContainer, {
          y: 100,
          autoAlpha: 0,
          stagger: 0.05,
          duration: 3,
          delay: 6,
          ease: "power2.out",
        })
        .to(
          "#wavy feTurbulence",
          {
            attr: { baseFrequency: "0.006" },
            duration: 20,
            stagger: 0.5,
            repeat: -1,
            yoyo: true,
          },
          "-=1"
        );
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
    mapText();

    if (!isAudioOn) {
      audio.play()
      isAudioOn = true
    }
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

  // map info animation
  gsap.set(mapInfo, {
    y: 10,
    autoAlpha: 0,
  });

  function mapText() {
    mapInfo.forEach((p, i) => {
      gsap.to(p, {
        y: 0,
        autoAlpha: 1,
        duration: 0.6,
        ease: "power2.out",
        delay: i * 1.2,
      });
    });
  }


  // audio
  audioToggle.addEventListener('click', () => {
    if (isAudioOn) {
      audio.pause()
      isAudioOn = false
    } else {
      audio.play()
      isAudioOn = true
    }
    updateAudioBtn()
  })

  function updateAudioBtn() {
    audioToggle.textContent = isAudioOn ? 'Audio ON' : 'Audio OFF'
  }



  // gsap ends
});





