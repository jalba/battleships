
'use strict';
var prompt = require('prompt');
var asciiArt = require('./asciiArt');
var chalk = require('chalk');

var GameLogic = require('./GameLogic');

var green = chalk.green;
var red = chalk.red;

var yesNo = /^(?:y\b|yes\b|Y\b|YES\b|n\b|N\b|no\b|NO\b)/;
var confirmError = green('please answer with y(es) or n(o)');

function confirmValidator(value) {
    var str = value.toLowerCase();
    if(str.indexOf('y') > -1) return true;
    else return false;
}

var startProps = {
	properties: {
		start: {
			description: green('Start a new Game? ') + red('(Y/N)'),
			type: 'string',
			pattern: yesNo,
			message: confirmError,
			required: true,
			before: confirmValidator
		}
	}
}

var playProps = {
	properties: {
		play: {
			description: green('Enter a coordinate: '),
			type: 'string',
			pattern: /^[a-jA-J][0-9]$/,
			message: 'The coordinates must be in the range [a-j][0-9]',
			required: true
		}
	}
};

function sigint(err) {
    if(err && err.message == 'canceled') process.exit();
}

function gameStart() {
    prompt.get(startProps, function (err, result) {
        sigint(err);
        if(!result.start) {
    	    console.log('Exiting Battleships...');
    	    process.exit();
        } else {
            console.log(green('OK'));
            console.log(green('Based on the following greed, you will need to provide input\n' +
    	                     'in the format A5 (row/collum) to try to sink the computers Battleships:'));
            console.log(asciiArt.grid);
            GameLogic.init(function() {console.log(green('Game Started:'))});
            play();
            
        }
    });
}

function play() {
    prompt.get(playProps, function (err, result) {
        sigint(err);
        GameLogic.fire(result.play.toUpperCase(), gameStart, play);
    });
}

console.log(asciiArt.battleship);

prompt.message = '';
prompt.delimiter = '';
prompt.start();

gameStart();
