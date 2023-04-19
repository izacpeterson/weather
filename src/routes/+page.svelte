<script>
  import { onMount } from "svelte";
  import { dataset_dev } from "svelte/internal";

  let alerts = [];
  let coords = {};
  let localWeather = {};
  let hourly = [];
  let daily = [];

  function getCoords() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
  async function getWeather() {
    coords = (await getCoords()).coords;
    const key = "35701ad524635b065706933439a9ab30";
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${coords.latitude}&lon=${coords.longitude}&appid=${key}&units=imperial`;

    let rawData = await fetch(url);
    let weather = await rawData.json();
    console.log(weather);

    localWeather = weather.current;

    localWeather.img = `https://openweathermap.org/img/wn/${localWeather.weather[0].icon}@4x.png`;
    localWeather.description = localWeather.weather[0].description;

    alerts = weather.alerts;

    hourly = weather.hourly;
    daily = weather.daily;
  }

  onMount(() => {
    getWeather();
  });
</script>

<!-- {#if alerts.length > 0}
  <div class="flex flex-col items-center bg-error">
    {#each alerts as alert}
      <span class="text-error-content"> {alert.event}</span>
      <p class="text-xs text-error-content">
        {alert.description}
      </p>
    {/each}
  </div>
{/if} -->

{#if localWeather.temp}
  <main class="flex justify-evenly flex-wrap p-4">
    <section class="flex flex-col pb-4 items-center">
      <h2 class="text-2xl">Current Weather</h2>
      <!-- <img src={localWeather.img} alt={localWeather.description} /> -->
      <span class="text-8xl">{Math.round(localWeather.temp)}&deg;</span>
      <h3 class="text-xl capitalize">{localWeather.description}</h3>
      <!-- <span>Feels Like: {localWeather.feels_like}&deg;</span> -->
      <span>Humidity: {localWeather.humidity}%</span>
      <!-- <span>Wind Speed: {localWeather.wind_speed} mph @ {localWeather.wind_deg}&deg;</span>
    <span>Cloud Coverage: {localWeather.clouds}%</span>
    <span class="text-xs">
      {coords.latitude}&deg; {coords.longitude}&deg;
    </span> -->
    </section>
    <!-- <section class="flex flex-col p-4 items-center">
    <h2 class="text-2xl">Home Weather</h2>
  </section> -->
    <section class="w-full pb-4">
      <h2>Hourly Forecast</h2>
      <div class="flex items-center overflow-x-auto">
        {#each hourly as hour, index}
          {#if index <= 12}
            <div class="m-2 flex flex-col items-center justify-center text-sm">
              <span>{new Date(parseInt(String(hour.dt) + "000")).toLocaleTimeString().split(":")[0]}{new Date(parseInt(String(hour.dt) + "000")).toLocaleTimeString().split(" ")[1]}</span>
              <img src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} />
              <span>{Math.round(hour.temp)}&deg;</span>
              <!-- <span>{hour.weather[0].main}</span> -->
            </div>
          {/if}
        {/each}
      </div>
    </section>
    <section class="w-full">
      <h2>Daily Forecast</h2>
      <div class="flex flex-col">
        {#each daily as day}
          <div class="collapse">
            <input type="checkbox" />
            <!-- <div class="collapse-title text-xl font-medium">Click me to show/hide content</div> -->
            <div class="flex items-center justify-evenly collapse-title !p-0 !m-0 !min-h-0 !h-auto">
              <span>{new Date(parseInt(String(day.dt) + "000")).toLocaleDateString()}</span>
              <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} />
              <span>High: {Math.round(day.temp.max)}&deg;</span>
              <span>Low: {Math.round(day.temp.min)}&deg;</span>
              <!-- <span>{day.weather[0].main}</span> -->
            </div>
            <div class="collapse-content px-8 flex flex-col">
              <span>Chance of precipitation: {day.pop * 100}%</span>
              <span>Humidity: {day.humidity}%</span>
              <span>Cloud Coverage: {day.clouds}%</span>
              <span>Sunrise: {new Date(parseInt(String(day.sunrise) + "000")).toLocaleTimeString()}</span>
              <span>Sunset: {new Date(parseInt(String(day.sunset) + "000")).toLocaleTimeString()}</span>
              <span>Moonrise: {new Date(parseInt(String(day.moonrise) + "000")).toLocaleTimeString()}</span>
              <span>Moonset: {new Date(parseInt(String(day.moonset) + "000")).toLocaleTimeString()}</span>
            </div>
          </div>
        {/each}
      </div>
    </section>
  </main>

  <!-- <pre>
    {JSON.stringify(daily[0], null, 2)}
</pre> -->
{:else}
  <div class="flex flex-col items-center">
    <h2 class="text-2xl">Loading...</h2>
    <!-- <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" /> -->
  </div>
{/if}
