var sirCanvas;
function onload() {
    document.body.style.opacity = 1;
    sirCanvas = setup_sir_canvas(document.getElementById('sir-canvas'), 50, 50);
    sirCanvas.start();
}
window.addEventListener('load', onload);
