import { todayWeather } from "../model/types";

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
      } else if (parseInt(TodayWeather[i].SKY) <= 5) {
        if (parseInt(TodayWeather[i].TIME) < 2000) {
          TodayWeather[i].ICON = "Sunny";
        } else {
          TodayWeather[i].ICON = "Clear";
        }
      } else if (
        5 < parseInt(TodayWeather[i].SKY) &&
        parseInt(TodayWeather[i].SKY) <= 8
      ) {
        TodayWeather[i].ICON = "PartlyCloudy";
      } else {
        TodayWeather[i].ICON = "Cloudy";
      }
    }
  }
};
