<script>
  import { onMount } from "svelte";

  let alerts = [];
  let coords = {};
  let localWeather = {};
  let hourly = [];

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
  }

  onMount(() => {
    getWeather();
  });
</script>

{#if alerts.length > 0}
  <div class="flex flex-col items-center bg-error">
    {#each alerts as alert}
      <span class="text-error-content"> {alert.event}</span>
      <p class="text-xs text-error-content">
        {alert.description}
      </p>
    {/each}
  </div>
{/if}

<main class="flex justify-evenly flex-wrap">
  <section class="flex flex-col p-4 items-center">
    <h2 class="text-2xl">Local Weather</h2>
    <img src={localWeather.img} alt={localWeather.description} />
    <h3 class="text-xl capitalize">{localWeather.description}</h3>
    <span>Temperature: {localWeather.temp}&deg;</span>
    <span>Humidity: {localWeather.humidity}%</span>
    <!-- <span>Wind Speed: {localWeather.wind_speed} mph</span> -->
    <!-- <span>Wind Direction: {localWeather.wind_deg}&deg;</span> -->
    <span class="text-xs">
      {coords.latitude}&deg; {coords.longitude}&deg;
    </span>
    <span />
  </section>
  <section class="flex flex-col p-4 items-center">
    <h2 class="text-2xl">Home Weather</h2>
  </section>
  <section class="w-full">
    <h2>Hourly Forecast</h2>
    <div class="flex justify-evenly flex-wrap">
      {#each hourly as hour, index}
        {#if index <= 12}
          <div class="m-2 flex flex-col items-center">
            <span
              >{new Date(parseInt(String(hour.dt) + "000"))
                .toLocaleTimeString()
                .split(":")[0]}{new Date(parseInt(String(hour.dt) + "000"))
                .toLocaleTimeString()
                .split(" ")[1]}</span
            >
            <span>{Math.round(hour.temp)}&deg;</span>
            <span>{hour.weather[0].main}</span>
          </div>
        {/if}
      {/each}
    </div>
  </section>
</main>

<!-- <pre>
    {JSON.stringify(hourly[0], null, 2)}
</pre> -->
