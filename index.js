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

app.use(express.static("public"));

async function getCurrentWeather(lat, lon, callback) {
  let url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=minutely,hourly,daily,alerts&units=imperial`;
  let response = await axios.get(url);
  fs.writeFileSync("./data.json", JSON.stringify(response.data));

  console.log(response.data);
  callback(response.data);
}
async function getHourlyWeather(lat, lon, callback) {
  let url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=current,minutely,daily,alerts&units=imperial`;
  let response = await axios.get(url);
  fs.writeFileSync("./hourly.json", JSON.stringify(response.data));

  console.log(response.data);
  callback(response.data);
}

// getWeather({ lat: lat, lon: lon });

app.get("/api/current", (req, res) => {
  getCurrentWeather(req.query.lat, req.query.lon, (data) => {
    res.send(data.current);
  });
});
app.get("/api/hourly", (req, res) => {
  getHourlyWeather(req.query.lat, req.query.lon, (data) => {
    res.send(data.hourly);
  });
});

app.get("/api/setHome", (req, res) => {
  fs.writeFileSync("./home.json", JSON.stringify(req.query));
  res.send("Home set");
});
app.get("/api/home", (req, res) => {
  let home = JSON.parse(fs.readFileSync("./home.json"));
  console.log(home);
  res.send(JSON.stringify(home));
});

app.get("/test/current", (req, res) => {
  const data = fs.readFileSync("./data.json");
  res.send(JSON.parse(data).current);
});
app.get("/test/hourly", (req, res) => {
  const data = fs.readFileSync("./hourly.json");
  res.send(JSON.parse(data).hourly);
});

app.listen(8083, () => {
  console.log("Server listening on 8083");
});
