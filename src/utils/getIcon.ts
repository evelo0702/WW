import { todayWeather, weekendWeatherData } from "../model/types";

export const getIcon = (TodayWeather: todayWeather[]) => {
  if (TodayWeather.length <= 1) return;
  TodayWeather.forEach((weather) => {
    const { PTY, SKY, TIME } = weather; 
    if (parseInt(PTY) > 0) {
      weather.ICON = ["Rainy", "Sleet", "Snowy", "Rainy"][parseInt(PTY) - 1];
    }
    else if (parseInt(SKY) === 1) {
      weather.ICON = parseInt(TIME) < 2000 ? "Sunny" : "Clear";
    }
    else if (parseInt(SKY) === 3 && parseInt(TIME) < 2000) {
      weather.ICON = "PartlyCloudy";
    }
    else {
      weather.ICON = "Cloudy";
    }
  });
};

export const getWeekendWeatherIcon = (
  weekendWeatherData: weekendWeatherData
) => {
  let temp = { amIcon: "", pmIcon: "" };

  switch (weekendWeatherData.wfAm) {
    case "맑음":
      temp.amIcon = "Sunny";
      break;
    case "구름많음":
      temp.amIcon = "PartlyCloudy";
      break;
    case "구름 많음":
      temp.amIcon = "PartlyCloudy";
      break;
    case "구름많고 비":
      temp.amIcon = "Rainy";
      break;
    case "구름많고 눈":
      temp.amIcon = "Snowy";
      break;
    case "구름많고 비/눈":
      temp.amIcon = "Rainy";
      break;
    case "구름많고 소나기":
      temp.amIcon = "Rainy";
      break;
    case "흐림":
      temp.amIcon = "Cloudy";
      break;
    case "흐리고 비":
      temp.amIcon = "Rainy";
      break;
    case "흐리고 비/눈":
      temp.amIcon = "Sleet";
      break;
    case "흐리고 소나기":
      temp.amIcon = "Rainy";
      break;
    case "흐리고 눈":
      temp.amIcon = "Snowy";
      break;
  }
  switch (weekendWeatherData.wfPm) {
    case "맑음":
      temp.pmIcon = "Clear";
      break;
    case "구름많음":
      temp.pmIcon = "Cloudy";
      break;
    case "구름 많음":
      temp.pmIcon = "Cloudy";
      break;

    case "구름많고 비":
      temp.pmIcon = "Rainy";
      break;
    case "구름많고 눈":
      temp.pmIcon = "Snowy";
      break;
    case "구름많고 비/눈":
      temp.pmIcon = "Rainy";
      break;
    case "구름많고 소나기":
      temp.pmIcon = "Rainy";
      break;
    case "흐림":
      temp.pmIcon = "Cloudy";
      break;
    case "흐리고 비":
      temp.pmIcon = "Rainy";
      break;
    case "흐리고 비/눈":
      temp.pmIcon = "Sleet";
      break;
    case "흐리고 소나기":
      temp.pmIcon = "Rainy";
      break;
    case "흐리고 눈":
      temp.pmIcon = "Snowy";
      break;
  }
  return temp;
 };
