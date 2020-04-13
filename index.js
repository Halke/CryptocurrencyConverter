//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
//const rp = require("request-promise")

const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

app.post("/", (req, res) => { 
    //console.log(req.body.crypto)
    var cryptoAbbr = req.body.crypto;
    var fiatAbbr = req.body.fiat;
    var cryptoAmount = parseInt(req.body.amount);

    if(!cryptoAmount){
        cryptoAmount = 1;
    }

    var options = {
        uri: "https://api.nomics.com/v1/currencies/ticker",
        method: "GET",
        qs: {
            key: "02fb56277635a4ca09ac25965daaf92b", 
            ids: cryptoAbbr,
            convert: fiatAbbr
        }
    };


    request(options, (error, response, body) => {

        var data = JSON.parse(body);

        var currentPrice = data[0].price;

        currentPrice *= cryptoAmount;

        res.write("<p>The price on the date: " + data[0].price_timestamp + "</p>");
    
        res.write("<h1>" + cryptoAmount + cryptoAbbr + " is currently worth " + currentPrice + fiatAbbr + "</h1>");
    
        res.send();
    })
    
});

    /*rp("https://api.nomics.com/v1/currencies/ticker?key=02fb56277635a4ca09ac25965daaf92b&ids=" + cryptoAbbr + "&interval=1d,30d&convert=" + fiatAbbr).then(body => {
        var data = JSON.parse(body);    
        var currentPrice = data[0].price;

        var currentDate = data[0].price_date;

        res.write("<p>The current date is " + currentDate + "</p>");

        res.write("<h1>The price of " + cryptoAbbr + " is " + currentPrice + " " + fiatAbbr + "</h1>");

        res.send();
    }).catch( err => {
        console.log(err);
    })
});*/

app.listen(3000, () => console.log("Server is running on port 3000."));
