import { loadingBar } from '/js/cover.js';
import { textAnimation } from '/js/cover.js';
import { customCursor } from '/js/cursor.js';

document.addEventListener("DOMContentLoaded", () => {
    textAnimation()
    loadingBar()
    customCursor()

    // quotes
    fetch("/js/quotes.json")
        .then(response => response.json())
        .then(data => {
            // Aquí ya tienes las citas cargadas
            console.log("Citas cargadas:", data);
            mostrarCitas(data);
        })
        .catch(error => console.error("Error al cargar las citas:", error));

    function mostrarCitas(quotes) {
        const container = document.querySelector('.quotes-container')

        quotes.forEach(quote => {
            const quoteElement = document.createElement('div')
            quoteElement.classList.add('quote')

            quoteElement.innerHTML = `
      <p class="quote-text">"${quote.text}"</p>`;

            container.appendChild(quoteElement);
        })
    }

});

