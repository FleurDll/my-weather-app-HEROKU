const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");

// INITIALISATION DE L'APP
const app = express();

// PERMETTRE DE LIRE LES DOCUMENTS IMG/CSS
app.use(express.static(__dirname + "/public"));

// PERMETTRE DE RECUPERER LES INFO DANS LA PAGE HTML
app.use(bodyParser.urlencoded({
  extended: true
}));

// SET VIEWS AVEC EJS
app.set("views", "./views");
app.set("views engine", "ejs");

// HOME ROUTE GET REQUESTS
app.get("/", function(req, res) {
  res.render(__dirname + "/views/meteo.ejs");
});

// HOME ROUTE POST REQUESTS
app.post("/", function(req, res) {
  const query = req.body.cityName;
  const apiKey = "0d19090abb5a0f99a36820be42fa1bcc";
  const units = "metric";
  const langue = "fr";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&lang=" + langue + "&appid=" + apiKey + "&units=" + units;

  // NOM DE VILLE CORRECTEMENT ECRIT
  queryLower = query.toLowerCase();
  queryLowerFirst = queryLower.slice(0, 1);
  queryLowerFirstUpper = queryLowerFirst.toUpperCase();
  queryLowerRest = queryLower.slice(1, queryLower.length);
  queryRight = queryLowerFirstUpper + queryLowerRest;

  // RECUPERATION DES DONNEES DE L'API OPEN WEATHER MAP

  https.get(url, function(response) {
    console.log(response.statusCode);

    if (response.statusCode === 200) {
      response.on("data", function(data) {
        const weatherData = JSON.parse(data);
        const country = weatherData.sys.country;
        const temp = weatherData.main.temp;
        const tempRessentie = weatherData.main.feels_like;
        const vent = weatherData.wind.speed;
        const humidity = weatherData.main.humidity;
        const icon = weatherData.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        res.render(__dirname + "/views/meteo2.ejs", {
          city: queryRight,
          country: country,
          imageURL: "http://openweathermap.org/img/wn/" + icon + "@2x.png",
          temp: temp + "°C",
          tempRessentie: tempRessentie + "°C",
          humidite: humidity + "%",
          vent: vent + "km/h"
        });

      });
    } else {
      res.render(__dirname + "/views/error.ejs");
    }
  });
});

// BOUTON RETOUR QUI REDIRIGE VERS HOME PAGE
app.post("/failure", function(req, res) {
  res.redirect("/");
})
app.post("/meteo2", function(req, res) {
  res.redirect("/");
});

// SET UP EXPRESS SERVER TO LISTEN
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});
