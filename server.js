'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var Viking = require('./Viking.js');
var vikingsList= [];

var findViking = function(id) {

    var viking = null;

    vikingsList.forEach(function(v){

        if (v.id === id) {
            viking = v;
        }

    });

};

var parseVikings = function() {

    var parsedVikings = [];

    vikingsList.forEach(function(v){

        parsedVikings.push( v.parse() );

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

        vikingsList.push( viking );

        var sendWithId = true;
        res.json( viking.parse(sendWithId) );
    })

    .put(function (req, res) {

        var viking = findViking(req.body.id);

        viking.action = req.body.action;

        res.json( viking.parse() );
    })

    .get(function (req, res) {

        res.json({vikings: parseVikings()});

    });


app.use('/api', router);

app.listen(port);
console.log('Server starting on port: ' + port);






