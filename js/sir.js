
function setup_sir_canvas(canvas, gridWidth, gridHeight) {
    var vars = {};

    canvas.width = window.innerWidth / 2;
    canvas.height = canvas.width;
    const ctx = canvas.getContext('2d');

    const colorBlack = 'rgb(0, 0, 0)';
    const colorWhite = 'rgb(255, 255, 255)';
    const colorGray = 'rgb(128, 128, 128)';

    const cellWidth = canvas.width / gridWidth;
    const cellHeight = canvas.height / gridHeight;
    var grid = [];
    var interval = 0;

    function clear_grid() {
        for (var y = 0; y < gridHeight; y++) {
            grid[y] = [];
            for (var x = 0; x < gridWidth; x++) {
                grid[y][x] = 0;
            }
        }
    }

    function initialize_grid() {
        for (var y = 0; y < gridHeight; y++) {
            grid[y] = [];
            for (var x = 0; x < gridWidth; x++) {
                if (Math.random() > 0.5) {
                    grid[y][x] = 1;
                } else {
                    grid[y][x] = 0;
                }
            }
        }
    }

    function advance_ca() {
        var newGrid = [];
        for (var y = 0; y < gridHeight; y++) {
            newGrid[y] = [];
            for (var x = 0; x < gridWidth; x++) {
                newGrid[y][x] = 0;  // Initialize to zero

                const y_up = (y - 1 + gridHeight) % gridHeight;
                const y_down = (y + 1) % gridHeight;
                const x_left = (x - 1 + gridWidth) % gridWidth;
                const x_right = (x + 1) % gridWidth;

                var count = 0;
                count += grid[y_up][x_left];
                count += grid[y_up][x];
                count += grid[y_up][x_right];
                count += grid[y][x_left];
                count += grid[y][x_right];
                count += grid[y_down][x_left];
                count += grid[y_down][x];
                count += grid[y_down][x_right];

                if (grid[y][x] == 1) {  // If cell alive
                    if (count == 2 || count == 3) {
                        newGrid[y][x] = 1;
                    }
                } else {  // cell dead
                    if (count == 3) {
                        newGrid[y][x] = 1;
                    }
                }
            }
        }
        grid = newGrid;
    }

    function draw_ca() {
        // White background
        ctx.fillStyle = colorWhite;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Fill cells if they are alive
        ctx.fillStyle = colorBlack;
        for (var y = 0; y < gridHeight; y++) {
            for (var x = 0; x < gridWidth; x++) {
                if (grid[y][x] == 1) {
                    ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
                }
            }
        }

        // Draw grid after so cells look like they are on the grid
        ctx.strokeStyle = colorGray;
        for (var x = 0; x < gridWidth + 1; x++) {
            ctx.strokeRect(x * cellWidth, 0, 0, canvas.height);
        }
        for (var y = 0; y < gridHeight + 1; y++) {
            ctx.strokeRect(0, y * cellHeight, canvas.width, 0);
        }
    }

    function ca_loop() {
        advance_ca();
        draw_ca();
    }

    vars.start = function() {
        interval = window.setInterval(ca_loop, 100);
    };

    vars.stop = function() {
        window.clearInterval(interval);
        interval = 0;
    };

    // TODO: Page should handle keypresses, this class should just implement their functionality
    function keypress(event) {
        if (event.code == 'KeyC') {  // Clear CA grid
            clear_grid();
            draw_ca();
        } else if (event.code == 'KeyR') {  // Reset grid to random values
            initialize_grid();
            draw_ca();
        } else if (event.code == 'KeyP') {  // Toggle pause/run CA
            if (interval != 0) {
                vars.stop();
            } else {
                vars.start();
            }
        } else if (event.code == 'KeyS') {  // Pause and step CA
            if (interval != 0) {
                vars.stop();
            }
            advance_ca();
            draw_ca();
        }
    }
    window.addEventListener('keypress', keypress);

    var cellsToggled = [];
    var clicked = false;

    function mousedown(event) {
        clicked = true;
        mousemove(event);
    }

    function mousemove(event) {
        if (!clicked) {
            return;
        }

        // Calculate mouse position
        const boundingRect = canvas.getBoundingClientRect();
        const x = (event.clientX - boundingRect.left) * canvas.width / boundingRect.width;
        const y = (event.clientY - boundingRect.top) * canvas.height / boundingRect.height;
        const gridX = parseInt(x / cellWidth);
        const gridY = parseInt(y / cellHeight);

        // Check if cell already flipped on this click
        if (cellsToggled.includes(gridY * gridWidth + gridX)) {
            return;
        } else {
            cellsToggled.push(gridY * gridWidth + gridX);
        }

        // Flip cell
        if (grid[gridY][gridX] == 0) {
            grid[gridY][gridX] = 1;
        } else {
            grid[gridY][gridX] = 0;
        }

        draw_ca();
    }

    function mouseup(event) {
        clicked = false;
        cellsToggled = [];
    }

    canvas.addEventListener('mousedown', mousedown);
    canvas.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);

    initialize_grid();
    draw_ca();

    return vars;
}
