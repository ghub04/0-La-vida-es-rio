import { getAudio } from './timelineCover.js'
import { moved } from './mapDrag.js';

console.log(getAudio())

const islands = document.querySelectorAll(".island-item");
const container = document.querySelector(".quote-container");
const closeBtn = document.querySelector(".close");
const popUp = document.querySelector(".quote-wrapper");
const mapInfo = document.querySelectorAll(".map-info p");

const audioPaper = new Audio('assets/paper-fx-sound.wav')
let fxPlayed = false

export function quoteLoad() {
  fetch("js/json/quotes.json")
    .then((response) => response.json())
    .then((quotes) => {
      // citas cargadas

      islands.forEach((island) => {
        island.addEventListener("click", () => {
          if (moved) return;
          const id = Number(island.dataset.id);
          const quote = quotes.find((q) => q.id === id);
          // console.log(id);

          if (quote) {
            container.innerHTML = `<p class='quote-text'>${quote.text}</p>`;
            container.classList.add("active");
            gsap.set(closeBtn, {
              autoAlpha: 0,
              y: 10,
            });
            openQuote();
            splitQuote();
          }
        });
      });

      closeBtn.addEventListener("click", () => {
        closeQuote();
      });
    })
    .catch((err) => console.error("Error cargando citas:", err));
}

// abrir la cita
function openQuote() {
  popUp.style.pointerEvents = "auto";
  let tlOpenQuote = gsap.timeline();

  gsap.set(popUp, {
    y: 50,
  })
  tlOpenQuote
    .to(popUp, {
      y: 30,
      autoAlpha: .9,
      duration: 0.2,
    })
    .to(container, {
      autoAlpha: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  // playFx()

}

// cerrar la cita
function closeQuote() {
  let tlCloseQuote = gsap.timeline();

  tlCloseQuote
    .to(popUp, {
      y: 50,
      autoAlpha: 0,
      duration: 0.2,
    })
    .to(container, {
      autoAlpha: 0,
      duration: 0.2,
      onComplete: () => {
        popUp.style.pointerEvents = "none";
      },
    });
  // playFx()
}

// aparece el boton seguir explorando
function close() {
  gsap.to(closeBtn, {
    autoAlpha: 1,
    duration: 1,
    // delay: 0.5,
  });
}

// animacion de la cita

function splitQuote() {
  let splitQuote = SplitText.create(".quote-text", {
    type: "words",
  });

  gsap.set(splitQuote.words, {
    autoAlpha: "30%",
  });
  gsap.to(splitQuote.words, {
    autoAlpha: 1,
    duration: 2,
    stagger: 0.05,
    onComplete: () => {
      close();
    },
  });
}

//fx sound
function playFx() {
  if (getAudio()) {
    audioPaper.play()
  }
}





