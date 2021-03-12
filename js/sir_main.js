var sirCanvas;
function onload() {
    document.body.style.opacity = 1;
    sirCanvas = setup_sir_canvas(document.getElementById('sir-canvas'), 50, 50);
    sirCanvas.start();
    var instructions = document.getElementById('instructions');
    instructions.innerText = '----- Key commands -----\n' +
        '1-6: change simulation\n' +
        'r: reset simulation\n' +
        'p: pause/unpause\n' +
        's: pause and step forward';
}
window.addEventListener('load', onload);
