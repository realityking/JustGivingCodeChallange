'use strict';

var express = require('express'); 
var app = express();
var port = process.env.PORT || 3000;

/*
 * Mock data
 */ 
var crowdFundingPage = {
    name: "Playground in Hackney Wick",
    totalPledged: 700,
    target: 2000,
    owner: "Holly Groom",
    story: "We are raising £3000 to build an adventure playground in Hackney Wick because the kids have nowhere to play"
};

/*
 * Helper functions
 */
var randomHttpCode = function(magnitude) {
    var httpCode = 200;
    var rand;

    magnitude = magnitude || 10;
    rand = Math.floor( Math.random()*10 ); 

    if(rand == 0) {
        httpCode = 500;
    }
    
    return httpCode;
};


/*
 * Configure express
 */ 
app.use(express.static(__dirname + '/assets'));

/*
 * Set up routes
 */
app.get('/', function(req, res){
    res.sendfile(__dirname + "/views/index.html");
});

app.get('/api/crowdFundingPage', function(req, res){
    res.json( crowdFundingPage );
});

/*
 * Updates the pledged amount by the amount specified
 * params:
 *        pledgeAmount: the amount pledged by the user 
 * response body:
 *        the total amount pledged so far
 *        ex: { "totalPledged": 5000 }
 *
 */ 
app.post('/api/pledge/:pledgeAmount', function(req, res){
    var httpCode = randomHttpCode();
    var pledgeAmount;

    if( httpCode >= 200 && httpCode < 300 ) {
        pledgeAmount = +req.params.pledgeAmount;
        crowdFundingPage.totalPledged += pledgeAmount;
    }

    res.status(httpCode).json({totalPledged: crowdFundingPage.totalPledged});
});

/*
 * Start it up
 */
app.listen(port);
console.log('Express started on port ' + port);
