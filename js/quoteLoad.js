const islands = document.querySelectorAll(".island-item");
const container = document.querySelector(".quote-container");
const closeBtn = document.querySelector(".close");
const popUp = document.querySelector(".quote-wrapper");
const mapInfo = document.querySelectorAll(".map-info p");

export function quoteLoad() {
  fetch("/js/quotes.json")
    .then((response) => response.json())
    .then((quotes) => {
      // citas cargadas

      islands.forEach((island) => {
        island.addEventListener("click", () => {
          const id = Number(island.dataset.id);
          const quote = quotes.find((q) => q.id === id);
          // console.log(id);

          if (quote) {
            container.innerHTML = `<p class='quote-text'>${quote.text}</p>`;
            container.classList.add("active");
            openQuote();
          }
        });
      });

      closeBtn.addEventListener("click", () => {
        // popUp.classList.remove("active");
        closeQuote();
      });
    })
    .catch((err) => console.error("Error cargando citas:", err));
}

// abrir la cita
function openQuote() {
  popUp.style.pointerEvents = "auto";
  let tlOpenQuote = gsap.timeline();

  tlOpenQuote
    .to(popUp, {
      autoAlpha: 1,
      duration: 0.2,
    })
    .to(container, {
      autoAlpha: 1,
      duration: 0.3,
      ease: "power2.out",
    });
}

// cerrar la cita
function closeQuote() {
  let tlCloseQuote = gsap.timeline();

  tlCloseQuote
    .to(popUp, {
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
}
