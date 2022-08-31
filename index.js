const axios = require("axios");
const express = require("express");
const app = express();
const fs = require("fs");

let apiKey = "35701ad524635b065706933439a9ab30";

// axios
//   .get(url)
//   .then((response) => {
//     console.log(response.data);
//     fs.writeFileSync('./data.json', JSON.stringify(response.data))
//   })
//   .catch((error) => {
//     console.log(error);
//   });

async function getCurrentWeather(lat, lon, callback) {
  let url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=minutely,hourly,daily,alerts&units=imperial`;
  let response = await axios.get(url);
  console.log(response.data);
  callback(response.data)
}

// getWeather({ lat: lat, lon: lon });

app.get("/current", (req, res) => {
  getCurrentWeather(req.query.lat, req.query.lon, (data) => {
    res.send(data);
  });
});

app.listen(8083, () => {
  console.log("Server listening on 8083");
});
