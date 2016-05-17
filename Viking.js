'use strict';

var shortid = require('shortid');

var mapSizeX = 200;
var mapSizeY = 200;

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

Viking.prototype.getActionPosition = function() {

    var position = {};

    var p = this.action.position;

    if (p.x >= -1 && p.x <= 1 && p.y >= -1 && p.y <= 1) {

        position.x = this.position.x + p.x;
        position.y = this.position.y + p.y;

        position.x = position.x < 0 ? 0 : position.x > mapSizeX ? mapSizeX : position.x;
        position.y = position.y < 0 ? 0 : position.y > mapSizeY ? mapSizeY : position.y;

    } else {
        throw new Error(this.id+ 'position of order is invalid');
    }

    return position;

};

Viking.prototype.isDead = function() {

    return this.health <= 0;
};

module.exports = Viking;