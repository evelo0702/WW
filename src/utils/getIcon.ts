import { todayWeather, weekendWeatherData } from "../model/types";

export const getIcon = (TodayWeather: todayWeather[]) => {
  // 1순위 - 강수형태 2순위 - 하늘 상태
  // 강수확률 0이고 하늘상태 맑음이면 20:00시 이전은 Sunny 이후면 Claer
  if (TodayWeather.length > 1) {
    for (let i = 0; i < TodayWeather.length; i++) {
      if (parseInt(TodayWeather[i].PTY) > 0) {
        switch (TodayWeather[i].PTY) {
          case "1":
            TodayWeather[i].ICON = "Rainy";
            break;
          case "2":
            TodayWeather[i].ICON = "Sleet";
            break;
          case "3":
            TodayWeather[i].ICON = "Snowy";
            break;
          case "4":
            TodayWeather[i].ICON = "Rainy";
            break;
        }
      } else if (parseInt(TodayWeather[i].SKY) === 1) {
        if (parseInt(TodayWeather[i].TIME) < 2000) {
          TodayWeather[i].ICON = "Sunny";
        } else {
          TodayWeather[i].ICON = "Clear";
        }
      } else if (
        parseInt(TodayWeather[i].SKY) === 3 &&
        parseInt(TodayWeather[i].TIME) < 2000
      ) {
        TodayWeather[i].ICON = "PartlyCloudy";
      } else {
        TodayWeather[i].ICON = "Cloudy";
      }
    }
  }
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
  //  맑음 - sunny(오전) / clear(오후)
  // - 구름많음 - partlyCloudy, 구름많고 비 rainy , 구름많고 눈 snowy , 구름많고 비/눈 sleet, 구름많고 소나기
  // - 흐림 - cloudy , 흐리고 비 rainy, 흐리고 눈 snowy, 흐리고 비/눈 sleet, 흐리고 소나기
};
// {
//   "day": "1일후",
//   "rnStAm": 0,
//   "rnStPm": 60,
//   "taMin": 26,
//   "wfAm": "맑음",
//   "taMax": 35,
//   "wfPm": "구름 많음"
// }
