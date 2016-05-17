'use strict';

var shortid = require('shortid');

function Viking() {

    this.id = shortid.generate();
    this.level = 1;
    this.health = 2;
    this.attack = 1;
    this.kills = 0;
    this.action = {order:'stop'};
    this.position = {x:0, y:0}; //todo: replace with map random position

}

Viking.prototype.parse = function(withId) {

    var vikingJSON = {
        level: this.level,
        health: this.health,
        attack: this.attack,
        kills: this.kills,
        action: this.action,
        position: this.position
    };

    if (withId) {
        vikingJSON.id = this.id;
    }

    return vikingJSON;
};

Viking.prototype.handleOrder = function() {


};

Viking.prototype.moveOrder = function() {


};

Viking.prototype.attackOrder = function() {


};

Viking.prototype.healOrder = function() {


};

Viking.prototype.calculateDeath = function() {


};

Viking.prototype.calculateLevel = function() {


};

module.exports = Viking;