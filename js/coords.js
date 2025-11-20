console.log("coords script loaded");

const coordsEl = document.querySelector(".coords");
console.log("coordsEl:", coordsEl);

function updateCoords() {
  const lat = (Math.random() * 180 - 90).toFixed(4);
  const lng = (Math.random() * 360 - 180).toFixed(4);
  coordsEl.textContent = `Lat: ${lat} | Lng: ${lng}`;
}

window.addEventListener("scroll", () => {
  console.log("scrollX:", window.scrollX);
  updateCoords();
});
