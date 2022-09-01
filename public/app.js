const isLive = false;
const url = isLive ? "/api" : "/test";
console.log(url);

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

  getData(`${url}/current?lat=${positon.coords.latitude}&lon=${positon.coords.longitude}`, (data) => {
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

  getData(`${url}/hourly?lat=${positon.coords.latitude}&lon=${positon.coords.longitude}`, (data) => {
    console.log(data);

    let lables = data.map((item) => {
      return new Date(parseInt(item.dt.toString() + "000")).toLocaleTimeString();
    });
    let temps = data.map((item) => {
      return item.temp;
    });
    let humidity = data.map((item) => {
      return item.humidity;
    });
    let pop = data.map((item) => {
      return item.pop;
    });
    let clouds = data.map((item) => {
      return item.clouds;
    });

    const tempctx = document.getElementById("tempChart").getContext("2d");
    const tempChart = new Chart(tempctx, {
      type: "line",
      data: {
        labels: lables,
        datasets: [
          {
            label: "Temperature",
            data: temps,
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });

    const humictx = document.getElementById("humiChart").getContext("2d");
    const humiChart = new Chart(humictx, {
      type: "line",
      data: {
        labels: lables,
        datasets: [
          {
            label: "Humidity",
            data: humidity,
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });

    const popctx = document.getElementById("popChart").getContext("2d");
    const popChart = new Chart(popctx, {
      type: "line",
      data: {
        labels: lables,
        datasets: [
          {
            label: "Precipitation",
            data: pop,
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });

    const cloudctx = document.getElementById("cloudChart").getContext("2d");
    const cloudChart = new Chart(cloudctx, {
      type: "line",
      data: {
        labels: lables,
        datasets: [
          {
            label: "Clouds",
            data: clouds,
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  });
});
