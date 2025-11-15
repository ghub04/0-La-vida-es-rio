export function quoteLoad() {
    fetch('/js/quotes.json')
        .then(response => response.json())
        .then(quotes => {
            // citas cargadas
            const islands = document.querySelectorAll('.island-item')
            const container = document.querySelector('.quote-container')

            islands.forEach(island => {
                island.addEventListener('click', () => {
                    const id = Number(island.dataset.id)
                    const quote = quotes.find(q => q.id === id)


                    if (quote) {
                        container.innerHTML =
                            `<p class="quote-text">"${quote.text}"</p>`;
                        container.classList.add('active')
                    }
                })
            })
        })
        .catch(err => console.error("Error cargando citas:", err));
}
