import { todayWeather, weekendWeatherData } from "../model/types";

export const getIcon = (TodayWeather: todayWeather[]) => {
  // TodayWeather 배열이 비어있지 않으면 처리 시작
  if (TodayWeather.length <= 1) return;

  // 날씨 정보를 순회하여 ICON 할당
  TodayWeather.forEach((weather) => {
    const { PTY, SKY, TIME } = weather; // 객체 구조 분해 할당

    // 강수형태에 따라 아이콘 설정
    if (parseInt(PTY) > 0) {
      weather.ICON = ["Rainy", "Sleet", "Snowy", "Rainy"][parseInt(PTY) - 1];
    }
    // 맑은 하늘일 때 (하늘 상태 1), 시간에 따라 Sunny 또는 Clear
    else if (parseInt(SKY) === 1) {
      weather.ICON = parseInt(TIME) < 2000 ? "Sunny" : "Clear";
    }
    // 부분 구름 낀 하늘일 때 (하늘 상태 3), 20:00 이전 PartlyCloudy
    else if (parseInt(SKY) === 3 && parseInt(TIME) < 2000) {
      weather.ICON = "PartlyCloudy";
    }
    // 그 외에는 Cloudy
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
