async function getData(url, callback) {
  let rawData = await fetch(url);
  let jsonData = await rawData.json();

  callback(jsonData);
}
function setValue(id, value) {
  document.getElementById(id).innerHTML = value;
}

navigator.geolocation.getCurrentPosition((positon) => {
  console.log(positon);

  getData(`/test/current?lat=${positon.coords.latitude}&lon=${positon.coords.longitude}`, (data) => {
    console.log(data);
    setValue("currentTemp", data.temp);
    setValue("currentHumidity", data.humidity);
    setValue("currentPressure", data.pressure);
    setValue("currentClouds", data.clouds);
    setValue("currentWindSpeed", data.wind_speed);
    setValue("currentWindDeg", data.wind_deg);
    setValue("currentSunrise", new Date(parseInt(data.sunrise.toString() + "000")).toLocaleTimeString());
    setValue("currentSunset", new Date(parseInt(data.sunset.toString() + "000")).toLocaleTimeString());
    setValue("currentVisibility", data.visibility / 1000);
  });
});
