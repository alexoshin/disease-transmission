
function setup_sir_canvas(canvas, gridWidth, gridHeight) {
    var vars = {};

    canvas.width = window.innerWidth / 2;
    canvas.height = canvas.width;
    const ctx = canvas.getContext('2d');

    const colorBlack = 'rgb(0, 0, 0)';
    const colorWhite = 'rgb(255, 255, 255)';
    const colorGray = 'rgb(128, 128, 128)';
    const colorSusceptible = 'rgb(0, 255, 0)';
    const colorInfected = 'rgb(255, 0, 0)';
    const colorRecovered = 'rgb(0, 0, 255)';

    const cellWidth = canvas.width / gridWidth;
    const cellHeight = canvas.height / gridHeight;
    var grid = [];  // Holds each agent status as well as infection time
    var interval = 0;

    // Simulation parameters
    var p_filled = 1.0;
    var p_infected = 0.005;
    var p_transmission = 0.1;
    var time_to_recovery = 10;

    var running = true;
    var curr_sim = 1;
    var sim_step = 0;

    function clear_grid() {
        for (var y = 0; y < gridHeight; y++) {
            grid[y] = [];
            for (var x = 0; x < gridWidth; x++) {
                grid[y][x] = [0, 0];
            }
        }
    }

    function initialize_sim(sim_num) {
        curr_sim = sim_num;
        p_infected = 0.005;
        switch (sim_num) {
            case 1:
                p_filled = 1;
                p_transmission = 0.1;
                time_to_recovery = 10;
                break;
            case 2:
                p_filled = 1;
                p_transmission = 0.05;
                time_to_recovery = 5;
                break;
            case 3:
                p_filled = 1;
                p_transmission = 0.1;
                time_to_recovery = 6;
                break;
            case 4:
                p_filled = 0.3;
                p_transmission = 0.2;
                time_to_recovery = 16;
                break;
            case 5:
                p_filled = 0.3;
                p_transmission = 0.1;
                time_to_recovery = 10;
                break;
            case 6:
                p_filled = 0.3;
                p_transmission = 0.22;
                time_to_recovery = 10;
                break;
            default:
                break;
        }
        initialize_grid();
        draw();
    }

    function initialize_grid() {
        sim_step = 0;
        for (var y = 0; y < gridHeight; y++) {
            grid[y] = [];
            for (var x = 0; x < gridWidth; x++) {
                if (Math.random() < p_filled) {
                    if (Math.random() < p_infected) {
                        grid[y][x] = [2, 0];
                    } else {
                        grid[y][x] = [1, 0]
                    }
                } else {
                    grid[y][x] = [0, 0];
                }
            }
        }
    }

    function advance() {
        check_transmission();
        handle_movement();
        sim_step += 1;
    }

    function check_transmission() {
        for (var y = 0; y < gridHeight; y++) {
            for (var x = 0; x < gridWidth; x++) {
                if (grid[y][x][0] == 1) {
                    const y_up = (y - 1 + gridHeight) % gridHeight;
                    const y_down = (y + 1) % gridHeight;
                    const x_left = (x - 1 + gridWidth) % gridWidth;
                    const x_right = (x + 1) % gridWidth;
                    if (grid[y_up][x][0] == 2) {
                        if (Math.random() < p_transmission) {
                            grid[y][x][0] = 2;
                            continue;
                        }
                    }
                    if (grid[y_down][x][0] == 2) {
                        if (Math.random() < p_transmission) {
                            grid[y][x][0] = 2;
                            continue;
                        }
                    }
                    if (grid[y][x_left][0] == 2) {
                        if (Math.random() < p_transmission) {
                            grid[y][x][0] = 2;
                            continue;
                        }
                    }
                    if (grid[y][x_right][0] == 2) {
                        if (Math.random() < p_transmission) {
                            grid[y][x][0] = 2;
                            continue;
                        }
                    }
                } else if (grid[y][x][0] == 2) {
                    grid[y][x][1] += 1;
                    if (grid[y][x][1] >= time_to_recovery) {
                        grid[y][x][0] = 3;
                    }
                }
            }
        }
    }

    function handle_movement() {
        var rand_inds = permutation(gridHeight * gridWidth);
        for (var i = 0; i < rand_inds.length; i++) {
            var ind = rand_inds[i];
            var y = Math.floor(ind / gridWidth);
            var x = ind % gridWidth;
            if (grid[y][x][0] != 0) {
                const y_up = (y - 1 + gridHeight) % gridHeight;
                const y_down = (y + 1) % gridHeight;
                const x_left = (x - 1 + gridWidth) % gridWidth;
                const x_right = (x + 1) % gridWidth;
                var rand_dirs = permutation(4);
                for (var j = 0; j < rand_dirs.length; j++) {
                    var dir = rand_dirs[j];
                    if (dir == 0) {
                        if (grid[y_up][x][0] == 0) {
                            grid[y_up][x] = grid[y][x];
                            grid[y][x] = [0, 0];
                            break;
                        }
                    } else if (dir == 1) {
                        if (grid[y_down][x][0] == 0) {
                            grid[y_down][x] = grid[y][x];
                            grid[y][x] = [0, 0];
                            break;
                        }
                    } else if (dir == 2) {
                        if (grid[y][x_left][0] == 0) {
                            grid[y][x_left] = grid[y][x];
                            grid[y][x] = [0, 0];
                            break;
                        }
                    } else if (dir == 3) {
                        if (grid[y][x_right][0] == 0) {
                            grid[y][x_right] = grid[y][x];
                            grid[y][x] = [0, 0];
                            break;
                        }
                    }
                }
            }
        }
    }

    function draw() {
        // White background
        ctx.fillStyle = colorWhite;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Fill cells
        ctx.fillStyle = colorBlack;
        for (var y = 0; y < gridHeight; y++) {
            for (var x = 0; x < gridWidth; x++) {
                if (grid[y][x][0] == 1) {
                    ctx.fillStyle = colorSusceptible;
                    ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
                } else if (grid[y][x][0] == 2) {
                    ctx.fillStyle = colorInfected;
                    ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
                } else if (grid[y][x][0] == 3) {
                    ctx.fillStyle = colorRecovered;
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

    function loop() {
        advance();
        draw();
    }

    vars.start = function() {
        interval = window.setInterval(loop, 75);
    };

    vars.stop = function() {
        window.clearInterval(interval);
        interval = 0;
    };

    // TODO: Page should handle keypresses, this class should just implement their functionality
    function keypress(event) {
        if (event.code == 'KeyC') {  // Clear grid
            clear_grid();
            draw();
        } else if (event.code == 'KeyR') {  // Reset grid to random values
            initialize_sim(curr_sim);
        } else if (event.code == 'KeyP') {  // Toggle pause/run
            if (interval != 0) {
                vars.stop();
            } else {
                vars.start();
            }
        } else if (event.code == 'KeyS') {  // Pause and step
            if (interval != 0) {
                vars.stop();
            }
            advance();
            draw();
        } else if (event.code == 'Digit1') {
            initialize_sim(1);
        } else if (event.code == 'Digit2') {
            initialize_sim(2);
        } else if (event.code == 'Digit3') {
            initialize_sim(3);
        } else if (event.code == 'Digit4') {
            initialize_sim(4);
        } else if (event.code == 'Digit5') {
            initialize_sim(5);
        } else if (event.code == 'Digit6') {
            initialize_sim(6);
        }
    }
    window.addEventListener('keypress', keypress);

    initialize_sim(1);

    return vars;
}

// Find a random permutation of n integers
function permutation(n) {
    var rand = [];
    for (var i = 0; i < n; i++) {
        rand[i] = i;
    }
    for (var i = n - 1; i > 0; i--) {
        var swap_ind = Math.floor(Math.random() * (i + 1));
        var swap_val = rand[swap_ind];
        rand[swap_ind] = rand[i];
        rand[i] = swap_val;
    }
    return rand;
}