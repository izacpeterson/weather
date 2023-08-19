import { writable } from "svelte/store";

export const weather = writable();

export async function getWeather(coords) {
  const key = "35701ad524635b065706933439a9ab30";
  console.log(coords);
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${coords.lat}&lon=${coords.lng}&appid=${key}&units=imperial`;

  const res = await fetch(url);
  const data = await res.json();
  console.log("WEATHER: ", data);
  weather.set(data);
  return data;
}
