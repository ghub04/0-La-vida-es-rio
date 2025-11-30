export let isAudioOn = false

export function getAudio() {
  return isAudioOn
}

document.addEventListener("DOMContentLoaded", () => {
  // console.log("init timeline cover");
  gsap.registerPlugin(SplitText);
  gsap.registerPlugin(DrawSVGPlugin)
  console.log('drawsvg')

  const borders = document.querySelector('.border-container')

  // COVER
  const cover = document.querySelector(".cover");

  const closeCover = document.querySelector("#close-cover");

  // MAPA
  const mapInfo = document.querySelectorAll(".map-info p");

  // TITLE
  const titleContainer = document.querySelector('.title')
  const titleH1 = document.querySelector('.title h1')

  // AUDIO
  const audio = new Audio('assets/forest-wind.mp3')
  const audioToggle = document.querySelector('.audio-btn')
  audio.loop = true

  // LOADER
  const preLoader = document.querySelector('.pre-loader')
  const loader = document.querySelector('.pre-loader svg path')

  // BACKGROUND SVG COVER
  const svgCover = document.querySelectorAll('.svg-cover svg g line')

  let tlCover = gsap.timeline();
  let split;

  // ANIMACION TITLE
  function textAnimation() {
    document.fonts.ready.then(() => {
      split = SplitText.create(titleH1, {
        type: "chars, words",
      });
      let textAnimation = gsap.timeline();
      let words = split.words

      textAnimation
        .from(titleContainer, {
          y: 100,
          autoAlpha: 0,
          duration: 3,
          ease: "power2.out",
        }).from(words, {
          y: 100,
          duration: 3,
          stagger: 0.5,
        }, '<')
        .to(
          "#wavy feTurbulence",
          {
            attr: { baseFrequency: "0.006" },
            duration: 20,
            stagger: 0.5,
            repeat: -1,
            yoyo: true,
          },
          "<"
        );
    });
  }
  // -------

  // LOADING
  gsap.set(loader, {
    drawSVG: '0'
  })
  let tlLoader = gsap.timeline()

  tlLoader.to(loader, {
    drawSVG: '100%',
    duration: 7,
    ease: 'power2.inOut',
  }).to(preLoader, {
    autoAlpha: 0,
    duration: 1,
  })
  // -------

  // CLOSE COVER
  gsap.set(closeCover, {
    y: 0,
    autoAlpha: 0,
  });

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
  // -------

  // MAP INFO
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
  // -------


  // AUDIO
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
  // -------

  // SVG COVER ANIM


  gsap.set(svgCover, {
    drawSVG: '0',
  })

  svgCover.forEach((path) => {
    gsap.to(path, {
      drawSVG: '100%',
      duration: 5,
    })
  })
  // -------




  // gsap ends
});





