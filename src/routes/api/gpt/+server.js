import { getWeather } from "$lib/weather";

export async function getChatGPT(coords) {
  let weather = await getWeather(coords);
  // weather = JSON.stringify(weather.daily[0]);
  // trim weather to the next 24hours from weather.hourly
  weather = JSON.stringify(weather.hourly.slice(0, 24));
  const messages = [
    { role: "system", content: `Write out a forcast given the provided data. Do not include an intro such as "The weather object provided" ${weather}` },
    { role: "user", content: "message here" },
    // { role: "assistant", content: "ChatGPT response here..." },
  ];
  console.log(messages);
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
  const chatGPT = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
  });

  const chatGPTMessage = chatGPT.data.choices[0].message?.content;
  console.log(chatGPTMessage);
  return chatGPTMessage;
}

export function GET({ url }) {
  let lat = url.searchParams.get("lat");
  let lng = url.searchParams.get("lng");

  setWeather({ temp: temp, humidity: humidity, location: location });

  return json({ temp: temp, humidity: humidity, location: location });
}
