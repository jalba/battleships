var child_process = require('child_process');
var expect = require('chai').expect;
var path = require('path');
var asciiArt = require('../asciiArt');

describe('Battleships game', function() {
    it('Should start and prompt the user to start a new game', function(done) {
        var spawn = require('child_process').spawn;
        var start    = spawn('node', [path.join(__dirname, '/../index.js')]);
        var startData = '';
        start.stdout.on('data', function (data) {
           startData += data;
           if(startData.indexOf('(Y/N)') > -1) {
               start.kill();
           }
        });
        start.stdout.on('end', function() {
            expect(startData.indexOf('Battleships')).to.equal(0);
            expect(startData.indexOf('Start a new Game? (Y/N)')).to.not.equal(-1);
            done();
        });
    });
    it('should diplay and explanation of the game mechanics on start of the game', function(done) {
        var spawn = require('child_process').spawn;
        var start    = spawn('node', [path.join(__dirname, '/../index.js')]);
        var startData = '';
        var enterCoordinatesStr = 'Enter a coordinate:';
        var called = false;
        start.stdout.on('data', function (data) {
            startData += data;
            if(startData.indexOf(enterCoordinatesStr) > -1) {
                expect(startData.indexOf('OK')).not.to.equal(-1);
                expect(startData.indexOf(asciiArt.grid.slice(10, 20))).not.to.equal(-1);
                done();
            }
            if(startData.indexOf('(Y/N)') > -1 && !called) {
                start.stdin.write('y');
                start.stdin.end();
                called = true;
            }
        });
    });
});
