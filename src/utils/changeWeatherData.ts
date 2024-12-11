import { weekendWeatherData } from "../model/types";

export const changeWeekendWeather = (data: weekendWeatherData) => {
  let result = Array.from({ length: 7 }, () => ({} as weekendWeatherData));

  for (let i = 0; i < result.length; i++) {
    let temp = Object.keys(data).filter((item) => {
      const index = item.indexOf(String(i + 1));

      return (
        index !== -1 &&
        (item[index + 1] === undefined || isNaN(Number(item[index + 1])))
      );
    });

    temp.forEach((item) => {
      let temp2 = "";
      item.split(String(i + 1)).forEach((it) => {
        temp2 += it;
      });
      result[i]["day"] = `${i + 1}일후`;
      result[i][temp2] = data[item];
    });
  }
  return result;
};
