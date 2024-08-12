import { weekendWeatherData } from "../model/types";

export const changeWeekendWeather = (data: weekendWeatherData) => {
  let result = Array.from({ length: 7 }, () => ({} as weekendWeatherData));

  for (let i = 0; i < result.length; i++) {
    let temp = Object.keys(data).filter((item) => {
      const index = item.indexOf(String(i + 1));

      return (
        index !== -1 &&
        // 다음에 문자가 없거나 다음에있는 문자가 숫자가 아닌경우
        (item[index + 1] === undefined || isNaN(Number(item[index + 1])))
      );
    });

    temp.forEach((item) => {
      let temp2 = "";
      item.split(String(i + 1)).forEach((it) => {
        temp2 += it;
      });
      result[i]["day"] = `${i + 1}일후 날씨`;
      result[i][temp2] = data[item];
    });
  }
  return result;
};

// {
//   "regId": "11B00000",//   "rnSt3Am": 40,//   "rnSt3Pm": 80,//   "rnSt4Am": 30,
//   "rnSt4Pm": 20,//   "rnSt5Am": 40,//   "rnSt5Pm": 40,//   "rnSt6Am": 20,
//   "rnSt6Pm": 40,//   "rnSt7Am": 40,//   "rnSt7Pm": 40,//   "rnSt8": 40,
//   "rnSt9": 40,//   "rnSt10": 40,//   "wf3Am": "구름많음",//   "wf3Pm": "구름많고 비",
//   "wf4Am": "흐림",//   "wf4Pm": "구름많음",//   "wf5Am": "구름많음",//   "wf5Pm": "구름많음",
//   "wf6Am": "맑음",//   "wf6Pm": "구름많음",//   "wf7Am": "구름많음",//   "wf7Pm": "구름많음",
//   "wf8": "흐림",//   "wf9": "흐림",//   "wf10": "흐림",//   "rnSt1Am": 30,//   "rnSt1Pm": 0,
//   "rnSt2Am": 30,//   "rnSt2Pm": 0,//   "taMin1": 26,//   "wf1Am": "흐림",//   "taMax1": 35,
//   "wf1Pm": "맑음",//   "taMin2": 25,//   "wf2Am": "흐림",//   "taMax2": 35,//   "wf2Pm": "맑음",
//   "taMax3": 34,//   "taMax4": 33,//   "taMax5": 32,//   "taMax6": 32,//   "taMax7": 32,
//   "taMin3": 25,//   "taMin4": 25,//   "taMin5": 25,//   "taMin6": 25,//   "taMin7": 25
// }
