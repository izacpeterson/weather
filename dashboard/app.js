let isLive = true;
let url = isLive ? "https://weather.izacpeterson.com/api" : "http://localhost:8083/test";

async function getData(url, callback) {
  let rawData = await fetch(url);
  let jsonData = await rawData.json();
  callback(jsonData);
}

function setData(id, data) {
  document.getElementById(id).innerHTML = data;
}

function addDayCard(date, high, low, condition) {
  document.querySelector("#forecast").innerHTML += `
  <div class="flex flex-col items-center text-3xl m-6 bg-slate-200 p-6 rounded-xl shadow-lg">
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
    // console.log(data);
    setData("currentTemp", Math.round(data.temp));
    setData("currentHumidity", Math.round(data.humidity));
    setData("currentPressure", Math.round(data.pressure));
    setData("currentUV", Math.round(data.uvi));
    setData("currentWindSpeed", Math.round(data.wind_speed));
    setData("currentWindDirection", Math.round(data.wind_deg));
    setData(
      "condition",
      data.weather[0].description
        .split(" ")
        .map((word) => {
          return word[0].toUpperCase() + word.substring(1);
        })
        .join(" ")
    );
    setData("img", `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png"/>`);
  });

  getData(`${url}/daily?lat=${positon.coords.latitude}&lon=${positon.coords.longitude}`, (data) => {
    console.log(data[0]);
    data.forEach((day) => {
      let dayOfWeek = new Date(parseInt(day.dt.toString() + "000")).toDateString().split(" ")[0];
      addDayCard(dayOfWeek, Math.round(day.temp.max), Math.round(day.temp.min), day.weather[0].icon);
    });
  });
});
