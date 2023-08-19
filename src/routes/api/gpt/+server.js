import { getWeather } from "$lib/weather";
import { json } from "@sveltejs/kit";
import { OpenAI } from "openai";
// import { OPENAI_KEY } from "$env/static/public";

async function getChatGPT(coords) {
  let weather = await getWeather(coords);
  // weather = JSON.stringify(weather.daily[0]);
  // trim weather to the next 24hours from weather.hourly
  weather = JSON.stringify(weather.hourly.slice(0, 24));
  const messages = [
    { role: "system", content: `Write out very short a forcast given the provided data. Do not include an intro such as "The weather object provided"` },
    { role: "user", content: `${weather}` },
    // { role: "assistant", content: "ChatGPT response here..." },
  ];

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
  });

  console.log(chatCompletion.choices[0].message);

  const chatGPTMessage = chatCompletion.choices[0].message;
  // const chatGPT = await openai.createChatCompletion({
  //   model: "gpt-4",
  //   messages,
  // });
  // const chatGPTMessage = chatGPT.data.choices[0].message;
  // console.log(chatGPTMessage);
  return chatGPTMessage;
}

export async function GET({ url }) {
  let lat = url.searchParams.get("lat");
  let lng = url.searchParams.get("lng");
  console.log(lat, lng);

  let weatherMessage = await getChatGPT({ lat: lat, lng: lng });

  return json({ weatherMessage, headers: { "Access-Control-Allow-Origin": "*" } });
}
