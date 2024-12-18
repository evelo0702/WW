import axios from "axios";
import { threeDayWeather, todayWeather } from "../model/types";
import { formattedDate } from "./formattedDate";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
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
let data = {
  rnSt1Am: 0,
  rnSt1Pm: 0,
  rnSt2Am: 0,
  rnSt2Pm: 0,
  rnSt3Am: 0,
  rnSt3Pm: 0,
  taMin1: 0,
  taMax1: 0,
  taMin2: 0,
  taMax2: 0,
  taMin3: 0,
  taMax3: 0,
  wf1Am: "",
  wf1Pm: "",
  wf2Am: "",
  wf2Pm: "",
  wf3Am: "",
  wf3Pm: "",
};
export async function getTodayWeatherData(
  nowDate: string,
  x: number,
  y: number,
  setTodayWeather: React.Dispatch<React.SetStateAction<todayWeather[]>>,
  setthreedayWeather: React.Dispatch<React.SetStateAction<threeDayWeather>>
) {
  try {
    const res = await axios.get(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${SECRET_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${nowDate}&base_time=0200&nx=${x}&ny=${y}`
    );
    if (res.data.response.body) {
      let temp = res.data.response.body.items.item;
      let totalForecast = temp.reduce(
        (acc: Forecast, item: ApiData) => {
          if (item.fcstDate !== item.baseDate) return acc;

          if (item.category === "TMN") acc.TMN = item.fcstValue;
          if (item.category === "TMX") acc.TMX = item.fcstValue;

          const isEvenTime = parseInt(item.fcstTime.slice(0, -2)) % 2 === 0;

          if (isEvenTime) {
            switch (item.category) {
              case "POP":
                acc.POP.push(item.fcstValue);
                acc.TIME.push(item.fcstTime);
                break;
              case "PTY":
                acc.PTY.push(item.fcstValue);
                break;
              case "PCP":
                acc.PCP.push(item.fcstValue);
                break;
              case "REH":
                acc.REH.push(item.fcstValue);
                break;
              case "SKY":
                acc.SKY.push(item.fcstValue);
                break;
              case "TMP":
                acc.TMP.push(item.fcstValue);
                break;
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
      

      setTodayWeather(
        temp2.filter(
          (i) =>
            i.TIME !== "0400" &&
            i.TIME !== "1600" &&
            i.TIME !== "1000" &&
            i.TIME !== "1400"
        )
      );
      let temp3 = res.data.response.body.items.item.slice(260);
      let temp4 = temp3.filter(
        (i: ApiData) =>
          ["TMX", "TMN"].includes(i.category) ||
          (["0600", "1800"].includes(i.fcstTime) &&
            ["SKY", "POP"].includes(i.category))
      );
      temp4.forEach((i: ApiData) => {
        const isAm = i.fcstTime === "0600";
        const isPm = i.fcstTime === "1800";
        const isTomorrow = Number(nowDate) + 1;
        if (isAm || isPm) {
          if (["SKY", "POP"].includes(i.category)) {
            const timePeriod = isAm
              ? Number(i.fcstDate) === isTomorrow
                ? "wf1Am"
                : Number(i.fcstDate) === isTomorrow + 1
                ? "wf2Am"
                : "wf3Am"
              : Number(i.fcstDate) === isTomorrow
              ? "wf1Pm"
              : Number(i.fcstDate) === isTomorrow + 1
              ? "wf2Pm"
              : "wf3Pm";
            const rainPeriod = isAm
              ? Number(i.fcstDate) === isTomorrow
                ? "rnSt1Am"
                : Number(i.fcstDate) === isTomorrow + 1
                ? "rnSt2Am"
                : "rnSt3Am"
              : Number(i.fcstDate) === isTomorrow
              ? "rnSt1Pm"
              : Number(i.fcstDate) === isTomorrow + 1
              ? "rnSt2Pm"
              : "rnSt3Pm";

            if (i.category === "SKY") {
              const skyConditions: { [key: string]: string } = {
                "1": "맑음",
                "3": "구름 많음",
                "4": "흐림",
              };
              data[timePeriod] = skyConditions[i.fcstValue];
            } else if (i.category === "POP") {
              data[rainPeriod] = Number(i.fcstValue);
            }
          }
        }

        if (i.category === "TMN") {
          const targetKey =
            Number(i.fcstDate) === isTomorrow
              ? "taMin1"
              : Number(i.fcstDate) === isTomorrow + 1
              ? "taMin2"
              : "taMin3";
          data[targetKey] = Number(i.fcstValue);
        }
        if (i.category === "TMX") {
          const targetKey =
            Number(i.fcstDate) === isTomorrow
              ? "taMax1"
              : Number(i.fcstDate) === isTomorrow + 1
              ? "taMax2"
              : "taMax3";
          data[targetKey] = Number(i.fcstValue);
        }
      });
      setthreedayWeather(data);
    }
  } catch (err) {
    console.error(err as Error);
  }
}

export async function getWeekendWeatherData(wkRegion: string) {
  try {
    const hours = new Date().getHours();
    const date =
      hours < 6
        ? Number(formattedDate()) - 1 + "0600"
        : formattedDate() + "0600";
    const res = await axios.get(
      `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=${SECRET_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${wkRegion}&tmFc=${date}`
    );
    if (res.data.response.body) {
      return res.data.response.body.items.item[0];
    }
  } catch (err) {
    console.error(err);
  }
}

export async function getWeekendTempData(wkRegion: string | null) {
  try {
    const hours = new Date().getHours();
    const date =
      hours < 6
        ? Number(formattedDate()) - 1 + "0600"
        : formattedDate() + "0600";
    const res = await axios.get(
      `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${SECRET_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${wkRegion}&tmFc=${date}`
    );
    if (res.data.response.body) {
      let data = res.data.response.body.items.item[0];
      let temp = {
        taMax4: data.taMax4,
        taMax5: data.taMax5,
        taMax6: data.taMax6,
        taMax7: data.taMax7,
        taMin4: data.taMin4,
        taMin5: data.taMin5,
        taMin6: data.taMin6,
        taMin7: data.taMin7,
      };
      return temp;
    }
  } catch (err) {
    console.error(err);
  }
}
