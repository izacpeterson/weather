import { json } from "@sveltejs/kit";
import { setWeather } from "../../../lib/firebase";

export function GET({ url }) {
  let temp = url.searchParams.get("temp");
  let humidity = url.searchParams.get("humidity");
  let location = url.searchParams.get("location");

  setWeather({ temp: temp, humidity: humidity, location: location });

  return json({ temp: temp, humidity: humidity, location: location });
}
