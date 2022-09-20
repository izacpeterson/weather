let isLive = true;
let url = isLive ? "https://weather.izacpeterson.com/api" : "http://localhost:8083/test";

//function to get data
async function getData(url, callback) {
  let rawData = await fetch(url);
  let jsonData = await rawData.json();
  callback(jsonData);
}

//Update the DOM, because I don't like writing out document.getElementById(id).innerHTML = data;
function setData(id, data) {
  document.getElementById(id).innerHTML = data;
}

//Add a day forecast card
function addDayCard(date, high, low, condition) {
  document.querySelector("#forecast").innerHTML += `
  <div class="flex flex-col items-center text-3xl m-6 p-6 rounded-xl shadow-lg bg-slate-200 ">
    <div>${date}</div>
    <img src="http://openweathermap.org/img/wn/${condition}@4x.png"/>
    <div>
        <span>${high}&deg;</span> <span class="text-gray-500">${low}&deg;</span>
    </div>
  </div>
  `;
}

if (new Date().getHours() < 12) {
  setData("greeting", "Moring");
} else if (new Date().getHours() > 12 && new Date().getHours() < 18) {
  setData("greeting", "Afternoon");
} else {
  setData("greeting", "Evening");
}

setData("dateTime", new Date().toLocaleString());

navigator.geolocation.getCurrentPosition((positon) => {
  console.log(positon);
  getData(`${url}/current?lat=${positon.coords.latitude}&lon=${positon.coords.longitude}`, (data) => {
    setData("currentTemp", Math.round(data.temp));
    setData("currentHumidity", Math.round(data.humidity));
    setData("currentPressure", Math.round(data.pressure));
    setData("currentUV", Math.round(data.uvi));
    setData("currentWindSpeed", Math.round(data.wind_speed));
    setData("currentWindDirection", Math.round(data.wind_deg));
    setData("img", `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png"/>`);
    setData(
      "condition",
      data.weather[0].description
        .split(" ")
        .map((word) => {
          return word[0].toUpperCase() + word.substring(1);
        })
        .join(" ")
    );
  });

  getData(`${url}/daily?lat=${positon.coords.latitude}&lon=${positon.coords.longitude}`, (data) => {
    data.forEach((day) => {
      let dayOfWeek = new Date(parseInt(day.dt.toString() + "000")).toDateString().split(" ")[0];
      addDayCard(dayOfWeek, Math.round(day.temp.max), Math.round(day.temp.min), day.weather[0].icon);
    });
  });

  getData(`${url}/hourly?lat=${positon.coords.latitude}&lon=${positon.coords.longitude}`, (data) => {
    let temps = [];
    let humidity = [];
    let clouds = [];
    let lables = [];
    console.log(data);
    for (let i = 0; i < 24; i++) {
      temps.push(data[i].temp);
      humidity.push(data[i].humidity);
      clouds.push(data[i].clouds);
      lables.push(new Date(parseInt(data[i].dt.toString() + "000")).toLocaleTimeString());
    }
    const tempctx = document.getElementById("tempChart").getContext("2d");
    const tempChart = new Chart(tempctx, {
      type: "line",
      data: {
        labels: lables,
        datasets: [
          {
            label: "Temperature F",
            data: temps,
            backgroundColor: ["#eb6e4b"],
            borderColor: ["#eb6e4b"],
            borderWidth: 1,
          },
          {
            label: "Humidity %",
            data: humidity,
            backgroundColor: ["#4b6eeb"],
            borderColor: ["#4b6eeb"],
            borderWidth: 1,
          },
          {
            label: "Clouds %",
            data: clouds,
            backgroundColor: ["green"],
            borderColor: ["green"],
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
