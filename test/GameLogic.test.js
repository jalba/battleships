var GameLogic = require('../GameLogic');
var child_process = require('child_process')
var expect = require('chai').expect;
var sinon = require('sinon');

var coordinate1 = 'A4';
var coordinate2 = 'A5';

describe('The GameLogic module', function() {
    beforeEach(function() {
        sinon.spy(console, 'log');
    });
    afterEach(function() {
        console.log.restore();
    });
    it('should expose two methos', function() {
        methodsArray = Object.keys(GameLogic);
        expect(methodsArray.length).to.equal(2);
        expect(methodsArray.indexOf('init')).not.to.equal(-1);
        expect(methodsArray.indexOf('fire')).not.to.equal(-1);
    });
    it('should inform the user that game is been initialised', function() {
        var callback = function() {};
        GameLogic.init(callback);
        var calledArgs = console.log.getCall(0).args[0];
        console.log(calledArgs);
        var condition = calledArgs.indexOf('generating game grid...') > -1;
        expect(condition).to.equal(true);
    });
    it('should call a callback function after game is initialised', function() {
        var callback = sinon.spy();
        GameLogic.init(callback);
        expect(callback.called).to.equal(true);

    });
    it('should inform the user the result of the play', function() {
        var finish = function() {};
        var callback = function() {};
        GameLogic.fire(coordinate2, finish, callback);
        var calledArgs = console.log.getCall(0).args[0];
        var condition = (calledArgs.indexOf('Miss...') > -1 || alledArgs.indexOf('Hit!!') > -1);
        expect(condition).to.equal(true);
    });
    it('should inform the user the coordinate is already been used', function() {
        var finish = function() {};
        var callback = function() {};
        var warning = 'You already fired on that coordinate, pick another one:';
        GameLogic.fire(coordinate2, finish, callback);
        var calledArgs = console.log.getCall(0).args[0];
        var condition = calledArgs.indexOf(warning) > -1;
        expect(condition).to.equal(true);
    });
    it('should call a callback function after player has entered some coordinate', function() {
        var callback = sinon.spy();
        var finish = function() {};
        GameLogic.fire(coordinate1, finish, callback);
        expect(callback.called).to.equal(true);
    });
});
