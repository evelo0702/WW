import axios from "axios";
import { todayWeather, twodayWeather } from "../model/types";
import { formattedDate } from "./formattedDate";

const SECRET_KEY = import.meta.env.SECRET_KEY;
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
  taMin1: 0,
  wf1Am: "",
  taMax1: 0,
  wf1Pm: "",
  taMin2: 0,
  wf2Am: "",
  taMax2: 0,
  wf2Pm: "",
};
export async function getTodayWeatherData(
  nowDate: string,
  x: number,
  y: number,
  setTodayWeather: React.Dispatch<React.SetStateAction<todayWeather[]>>,
  settwodayWeather: React.Dispatch<React.SetStateAction<twodayWeather>>
) {
  try {
    const res = await axios.get(
      // 초단기예보
      // `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${secret_key}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${nowDate}&base_time=0600&nx=${x}&ny=${y}`

      // 단기예보
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${SECRET_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${nowDate}&base_time=0200&nx=${x}&ny=${y}`
    );

    if (res.data.response.body) {
      // 오늘의 날씨
      let temp = res.data.response.body.items.item;
      let totalForecast = temp.reduce(
        (acc: Forecast, item: ApiData) => {
          if (item.fcstDate === item.baseDate) {
            if (item.category === "TMN") {
              acc.TMN = item.fcstValue;
            }
            if (item.category === "TMX") {
              acc.TMX = item.fcstValue;
            }
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

      // 내일 모레 날씨
      let temp3 = res.data.response.body.items.item.slice(260);
      let temp4 = temp3.filter(
        (i: ApiData) =>
          i.category === "TMX" ||
          i.category === "TMN" ||
          (i.fcstTime === "0600" && i.category === "SKY") ||
          (i.fcstTime === "1800" && i.category === "SKY") ||
          (i.fcstTime === "0600" && i.category === "POP") ||
          (i.fcstTime === "1800" && i.category === "POP")
      );
      temp4.map((i: ApiData) => {
        if (Number(i.fcstDate) === Number(nowDate) + 1) {
          if (i.fcstTime === "0600") {
            if (i.category === "SKY") {
              switch (i.fcstValue) {
                case "1":
                  return (data.wf1Am = "맑음");
                case "3":
                  return (data.wf1Am = "구름 많음");
                case "4":
                  return (data.wf1Am = "흐림");
              }
            } else if (i.category === "POP") {
              data.rnSt1Am = Number(i.fcstValue);
            }
          }
          if (i.category === "TMN") {
            data.taMin1 = Number(i.fcstValue);
          }
          if (i.category === "TMX") {
            data.taMax1 = Number(i.fcstValue);
          } else if (i.fcstTime === "1800") {
            if (i.category === "SKY") {
              switch (i.fcstValue) {
                case "1":
                  return (data.wf1Pm = "맑음");
                case "3":
                  return (data.wf1Pm = "구름 많음");
                case "4":
                  return (data.wf1Pm = "흐림");
              }
            } else if (i.category === "POP") {
              data.rnSt1Pm = Number(i.fcstValue);
            }
          }
        } else if (Number(i.fcstDate) === Number(nowDate) + 2) {
          if (i.fcstTime === "0600") {
            if (i.category === "SKY") {
              switch (i.fcstValue) {
                case "1":
                  return (data.wf2Am = "맑음");
                case "3":
                  return (data.wf2Am = "구름 많음");
                case "4":
                  return (data.wf2Am = "흐림");
              }
            } else if (i.category === "POP") {
              data.rnSt2Am = Number(i.fcstValue);
            }
          }
          if (i.category === "TMN") {
            data.taMin2 = Number(i.fcstValue);
          }
          if (i.category === "TMX") {
            data.taMax2 = Number(i.fcstValue);
          } else if (i.fcstTime === "1800") {
            if (i.category === "SKY") {
              switch (i.fcstValue) {
                case "1":
                  return (data.wf2Pm = "맑음");
                case "3":
                  return (data.wf2Pm = "구름 많음");
                case "4":
                  return (data.wf2Pm = "흐림");
              }
            } else if (i.category === "POP") {
              data.rnSt2Pm = Number(i.fcstValue);
            }
          }
        }
      });
      settwodayWeather(data);
    }
  } catch (err) {
    console.error(err as Error);
  }
}

// 중기날씨api는 오늘기준으로 3일후부터 제공하기때문에
// 1,2일후 날씨는 단기예보api를 사용해서 따로 받아와야함
export async function getWeekendWeatherData(wkRegion: string) {
  try {
    // 중기날씨
    let date = formattedDate();
    let time = new Date().getHours();
    if (time > 6 && time < 18) {
      date = date + "0600";
    } else {
      date = date + "1800";
    }
    const res = await axios.get(
      `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=${SECRET_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${wkRegion}&tmFc=${date}`
    );
    if (res) {
      return res.data.response.body.items.item[0];
    }
  } catch (err) {
    console.error(err);
  }
}
// 중기기온을 받아오는 메소드
export async function getWeekendTempData(wkRegion: string | null) {
  try {
    let date = formattedDate();
    let time = new Date().getHours();
    if (time > 6 && time < 18) {
      date = date + "0600";
    } else {
      date = date + "1800";
    }
    const res = await axios.get(
      `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${SECRET_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${wkRegion}&tmFc=${date}`
    );

    if (res) {
      let data = res.data.response.body.items.item[0];
      let temp = {
        taMax3: data.taMax3,
        taMax4: data.taMax4,
        taMax5: data.taMax5,
        taMax6: data.taMax6,
        taMax7: data.taMax7,
        taMin3: data.taMin3,
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
// POP-강수확률,PTY-강수형태,PCP-강수량,REH-습도,SKY-하늘상태,TMP-기온
// 필터처리할때 fcstDate fcstTime category 가져올값  fcstValue
// 데이터 0-99: 0200~ 1100 100-199: 1100~1900 200-278: 1900- 0100
// 하루 일보 4시, 6시 , 8시 , 10시 , 12시, 14시 , 16시 , 18시 , 20시 , 22시
