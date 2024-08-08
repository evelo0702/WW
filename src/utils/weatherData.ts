import axios from "axios";
import { todayWeather } from "../model/types";

interface ApiData {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstValue: string;
  fcstTime: string;
  nx: number;
  ny: number;
}
interface Forecast {
  POP: string[];
  PTY: string[];
  PCP: string[];
  REH: string[];
  SKY: string[];
  TMP: string[];
  TIME: string[];
  TMN: string;
  TMX: string;
}
export async function getWeatherData(
  nowDate: string,
  secret_key: string,
  x: number,
  y: number,
  setTodayWeather: React.Dispatch<React.SetStateAction<todayWeather[]>>
) {
  try {
    const res = await axios.get(
      // 초단기예보
      // `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${secret_key}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${nowDate}&base_time=0600&nx=${x}&ny=${y}`

      // 단기예보
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${secret_key}&pageNo=1&numOfRows=280&dataType=JSON&base_date=${nowDate}&base_time=0200&nx=${x}&ny=${y}`
    );
    //
    if (res.data.response.body) {
      let temp = res.data.response.body.items.item;
      let totalForecast = temp.reduce(
        (acc: Forecast, item: ApiData) => {
          if (item.category === "TMN") {
            acc.TMN = item.fcstValue;
          }
          if (item.category === "TMX") {
            acc.TMX = item.fcstValue;
          }
          if (item.fcstDate === item.baseDate) {
            if (
              item.category === "POP" &&
              parseInt(item.fcstTime.slice(0, -2)) % 2 === 0
            ) {
              acc.POP.push(item.fcstValue);
              acc.TIME.push(item.fcstTime);
            } else if (
              item.category === "PTY" &&
              parseInt(item.fcstTime.slice(0, -2)) % 2 === 0
            ) {
              acc.PTY.push(item.fcstValue);
            } else if (
              item.category === "PCP" &&
              parseInt(item.fcstTime.slice(0, -2)) % 2 === 0
            ) {
              acc.PCP.push(item.fcstValue);
            } else if (
              item.category === "REH" &&
              parseInt(item.fcstTime.slice(0, -2)) % 2 === 0
            ) {
              acc.REH.push(item.fcstValue);
            } else if (
              item.category === "SKY" &&
              parseInt(item.fcstTime.slice(0, -2)) % 2 === 0
            ) {
              acc.SKY.push(item.fcstValue);
            } else if (
              item.category === "TMP" &&
              parseInt(item.fcstTime.slice(0, -2)) % 2 === 0
            ) {
              acc.TMP.push(item.fcstValue);
            }
          }
          return acc;
        },
        {
          POP: [],
          PTY: [],
          PCP: [],
          REH: [],
          SKY: [],
          TMP: [],
          TMN: "",
          TMX: "",
          TIME: [],
        }
      );
      let temp2 = [];
      for (let i = 0; i < totalForecast.POP.length; i++) {
        let temp = {
          ID: i,
          ICON: "",
          TMX: totalForecast.TMX,
          TMN: totalForecast.TMN,
          TIME: totalForecast.TIME[i],
          TMP: totalForecast.TMP[i],
          SKY: totalForecast.SKY[i],
          REH: totalForecast.REH[i],
          PTY: totalForecast.PTY[i],
          PCP: totalForecast.PCP[i],
          POP: totalForecast.POP[i],
        };
        temp2.push(temp);
      }
      setTodayWeather(temp2);
    }
  } catch (err) {
    console.error(err as Error);
  }
}

// POP-강수확률,PTY-강수형태,PCP-강수량,REH-습도,SKY-하늘상태,TMP-기온
// 필터처리할때 fcstDate fcstTime category 가져올값  fcstValue
// 데이터 0-99: 0200~ 1100 100-199: 1100~1900 200-278: 1900- 0100
// 하루 일보 4시, 6시 , 8시 , 10시 , 12시, 14시 , 16시 , 18시 , 20시 , 22시
