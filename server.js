'use strict';

var express = require('express');
var app = express();
var cors = require('cors');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var mapSizeX = 100;
var mapSizeY = 100;

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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var router = express.Router();

router.get('/', function (req, res) {
    res.json({message: 'It works!'});
});

router.route('/vikings')

    .post(function (req, res) {

        var viking = new Viking();

        var maxTries = 10;
        var position = {x: getRandomInt(0,mapSizeX), y: getRandomInt(0,mapSizeY)};

        while(findVikingByPosition(position) && maxTries--) {
            position = {x: getRandomInt(0,mapSizeX), y: getRandomInt(0,mapSizeY)};
        }

        if (maxTries === 0 ) {
            res.json({error: 'could not find empty spot for you viking, please try again'});
            return;
        }

        viking.position = position;

        viking.name = req.body.name;

        vikingsList.push(viking);

        var sendWithId = true;
        res.json(viking.parse(sendWithId));

        io.sockets.emit('vikingsUpdate', {vikings: parseVikings()});
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

var handleVikingAttack = function (viking) {

    try {

        var attackPosition = viking.getActionPosition();

        var otherViking = findVikingByPosition(attackPosition);

        if (otherViking) {

            otherViking.health -= viking.level;

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

var handleVikingHeal = function (viking) {

    try {

        viking.increaseHitPoints(Math.floor(viking.level/2));

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

var resetVikingsOrders = function() {

    vikingsList.forEach(function (viking) {

        viking.action.order = 'stop';

    });

};

var levelUpVikings = function() {

    vikingsList.forEach(function (viking) {

        viking.checkForLevelUp();

    });

};

var gameRound = 1;

var gameUpdate = function () {

    console.log('Game round '+ (gameRound++));

    var vikings = findVikingsByOrder('attack');

    vikings.forEach(function (viking) {

        handleVikingAttack(viking);

    });

    disposeBodies();

    levelUpVikings();

    vikings = findVikingsByOrder('move');

    vikings.forEach(function (viking) {

        handleVikingMove(viking);

    });

    vikings = findVikingsByOrder('heal');

    vikings.forEach(function (viking) {

        handleVikingHeal(viking);

    });

    resetVikingsOrders();

    io.sockets.emit('vikingsUpdate', {vikings: parseVikings()});

};

var gameInterval = setInterval(gameUpdate, 10000);

io.on('connection', function(){
    console.log('a user connected');
});

http.listen(port, function(){
    console.log('listening on '+ port);
});

