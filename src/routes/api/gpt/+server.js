import { getWeather } from "$lib/weather";
import { json } from "@sveltejs/kit";
import { Configuration, OpenAIApi } from "openai";

async function getChatGPT(coords) {
  let weather = await getWeather(coords);
  // weather = JSON.stringify(weather.daily[0]);
  // trim weather to the next 24hours from weather.hourly
  weather = JSON.stringify(weather.hourly.slice(0, 24));
  const messages = [
    { role: "system", content: `Write out a forcast given the provided data. Do not include an intro such as "The weather object provided" ${weather}` },
    // { role: "user", content: "message here" },
    // { role: "assistant", content: "ChatGPT response here..." },
  ];
  console.log(messages);
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);

  // adfsds

  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: "Hello world" }],
  });
  console.log(completion.data.choices[0].message);

  console.log(chatGPTMessage);
  return chatGPTMessage;
}

export function GET({ url }) {
  let lat = url.searchParams.get("lat");
  let lng = url.searchParams.get("lng");

  getChatGPT({ lat: lat, lng: lng });

  return json({});
}
