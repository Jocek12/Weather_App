require('dotenv').config();
const express = require("express");
const https = require("https");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public")); // LINKING CSS TO WEBSITE
app.use(bodyParser.urlencoded({extended: true}));

// CSS Link
app.use(express.static(__dirname));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
    
});

app.post("/", function(req, res) {

    const query = req.body.cityName;
    const unit = "metric";

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + process.env.API_KEY + "&units=" + unit;


    https.get(url, function (response) {

        console.log(response.statusCode);

        response.on("data", function(data) {

            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const windSpeed = weatherData.wind.speed;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.render("answer", { query: query, temp: temp, weatherDescription: weatherDescription, windSpeed: windSpeed, imageURL: imageURL });
            
        });
    });
});


app.listen(3000, function() {
    console.log("Server is running on port 3000.");
});