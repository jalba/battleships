var chalk = require('chalk');

var battleships = {
    battleship: { locations: [], size: 5 },
    destroyers: { locations: [], size: 4 }
};

var grid = {
    A: [],
    B: [],
    C: [],
    D: [],
    E: [],
    F: [],
    G: [],
    H: [],
    I: [],
    J: []
};

function generateLocation(battleship) {
    var direction = Math.floor(Math.random() * 2);
    var rows = Object.keys(grid);
    var i = 0;
    var row;
    var col;
    var location = [];
    if(direction === 1) { //vertical
        row = Math.floor(Math.random() * (rows.length - battleships[battleship].size + 1));
        col = Math.floor(Math.random() * rows.length);
        } else { //horizontal
        row = Math.floor(Math.random() * rows.length);
        col = Math.floor(Math.random() * (rows.length - battleships[battleship].size + 1));
    }
    for (i; i < battleships[battleship].size; i++) {
        if (direction === 1) {
            location.push(rows[row + i] + col);
        } else {
            location.push(rows[row] + (col + i));
        }
    }

    return location;
}

function cleanData() {
    if(battleships.battleship.locations[0]) {
        for(var row in grid) {
            grid[row] = [];
        }
        battleships.battleship.locations = [];
        battleships.destroyers.locations = [];
    }
}

function init(next) {
    console.log('generating game grid...');
    cleanData();
    battleships.battleship.locations.push(generateLocation('battleship'));
    var destroyers = battleships.destroyers;
    var i = 0;
    var detroyerLocation;
    for(i; i < 2; i++){
        destroyerLocation = generateLocation('destroyers');
        while(doesCollide(destroyerLocation)) {
            destroyerLocation = generateLocation('destroyers');
        }
        destroyers.locations.push(destroyerLocation);
    }
    next();
}

function doesCollide(location) {
    for(var battleship in battleships) {
        if(battleships[battleship].locations.some(function(ship) {
            var collision = location.filter(function(coordinate) {
                return ship.indexOf(coordinate) !== -1;
            });
            return !!collision.length;
        })) return true;
    }
    return false;
}

function addcoordinate(coordinate) {
    grid[coordinate[0]].push(coordinate[1]);
}

function fire(coordinate, finish, next) {
    if(!coordinateExist(coordinate)) {
        addcoordinate(coordinate);
        if(isHit(coordinate)) {
            var ship = getBattleShipFromcoordinate(coordinate);
            handleHit(ship, coordinate);
            if(isSunk(ship)) {
                if(!shipsLeft()) {
                    console.log(chalk.green('Congratulations, You have sunk all the battleships! You Won!!!'));
                    finish();
                } else {
                    console.log(chalk.green('Great, you just sunk a ship!!!!'));
                    next();
                }
            } else {
                console.log(chalk.green('Hit!!'));
                next();
            }
        } else {
            console.log(chalk.green('Miss...'));
            next();
        }
    } else {
        console.log(chalk.red('You already fired on that coordinate, pick another one:'));
        next();
    }
}

function handleHit(battleship, coordinate) {
    var index = battleship.indexOf(coordinate);
    battleship[index] = 1;
}

function getBattleShipFromcoordinate(coordinate) {
    var battleship;
    for(var ship in battleships) {
        battleship = battleships[ship].locations.filter(function(location) {
            return location.indexOf(coordinate) !== -1;
        })[0];
        if(battleship && battleship.length > 0) {
            return battleships[ship].locations[battleships[ship].locations.indexOf(battleship)];
        }
    }
}

function shipsLeft() {
    var ships = battleships.battleship.locations[0].concat(battleships.destroyers.locations[0],
                                                        battleships.destroyers.locations[1]);
    return !isSunk(ships);
}

function coordinateExist(coordinate) {
    return !!(grid[coordinate[0]].indexOf(coordinate[1]) + 1);
}

function isHit(coordinate) {
    return doesCollide([coordinate]);
}

function isSunk(battleship) {
    var result = battleship.reduce(function(prev, current) {
        return prev + current;
    });
    return !isNaN(result);
}

module.exports = {
    fire: fire,
    init: init
}

