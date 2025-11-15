export function quoteLoad() {
  fetch("/js/quotes.json")
    .then((response) => response.json())
    .then((quotes) => {
      // citas cargadas
      const islands = document.querySelectorAll(".island-item");
      const container = document.querySelector(".quote-container");
      const closeBtn = document.querySelector(".close");
      const popUp = document.querySelector(".quote-wrapper");

      islands.forEach((island) => {
        island.addEventListener("click", () => {
          const id = Number(island.dataset.id);
          const quote = quotes.find((q) => q.id === id);
          console.log(id);

          if (quote) {
            container.innerHTML = `<p class='quote-text'>"${quote.text}"</p>`;
            container.classList.add("active");

            popUp.classList.add("active");

            closeBtn.addEventListener("click", () => {
              popUp.classList.remove("active");
            });
          }
        });
      });
    })
    .catch((err) => console.error("Error cargando citas:", err));
}
