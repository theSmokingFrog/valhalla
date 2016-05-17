'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var Viking = require('./Viking.js');
var vikingsList = [];

var findVikingById = function (id) {

    var viking = null;

    vikingsList.forEach(function (v) {

        if (v.id === id) {
            viking = v;
        }

    });

    return viking;

};

var findVikingByPosition = function (position) {

    var viking = null;

    vikingsList.forEach(function (v) {

        if (v.position.x === position.x && v.position.y === position.y) {
            viking = v;
        }

    });

    return viking;

};

var findVikingsByOrder = function (order) {

    var vikings = [];

    vikingsList.forEach(function (v) {

        if (v.action.order === order) {
            vikings.push(v);
        }

    });

    return vikings;

};

var parseVikings = function () {

    var parsedVikings = [];

    vikingsList.forEach(function (v) {

        parsedVikings.push(v.parse());

    });

    return parsedVikings;
};

var router = express.Router();

router.get('/', function (req, res) {
    res.json({message: 'It works!'});
});

router.route('/vikings')

    .post(function (req, res) {

        var viking = new Viking();

        vikingsList.push(viking);

        var sendWithId = true;
        res.json(viking.parse(sendWithId));
    })

    .put(function (req, res) {

        var viking = findVikingById(req.body.id);

        viking.action = req.body.action;

        res.json(viking.parse());
    })

    .get(function (req, res) {

        res.json({vikings: parseVikings()});

    });


app.use('/api', router);

app.listen(port);
console.log('Server starting on port: ' + port);


var handleVikingAttack = function (viking) {

    try {

        var attackPosition = viking.getActionPosition();

        var otherViking = findVikingByPosition(attackPosition);

        if (otherViking) {

            otherViking.health -= viking.attack;

            if (otherViking.isDead()) {
                viking.kills += 1;
            }

        }

    } catch (e) {
        console.log(e);
    }

};

var handleVikingMove = function (viking) {

    try {

        if (viking.isDead()) {

            throw new Error(viking.id + ' died in previous action');

        }

        var movePosition = viking.getActionPosition();

        var otherViking = findVikingByPosition(movePosition);

        if (otherViking) {

            throw new Error(viking.id + ' something is in my way');
        }

        viking.position = movePosition;

    } catch (e) {
        console.log(e);
    }

};

var disposeBodies = function() {

    var i = vikingsList.length;

    while (i--) {

        var viking = vikingsList[i];

        if (viking.isDead()) {
            vikingsList.splice(i, 1);
        }
    }
};

var gameRound = 1;

var gameUpdate = function () {

    console.log('Game round '+ (gameRound++));

    var vikings = findVikingsByOrder('attack');

    vikings.forEach(function (viking) {

        handleVikingAttack(viking);

    });

    vikings = findVikingsByOrder('move');

    vikings.forEach(function (viking) {

        handleVikingMove(viking);

    });


    disposeBodies();

};

var gameInterval = setInterval(gameUpdate, 10000);
