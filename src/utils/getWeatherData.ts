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
  // 강수확률
  rnSt1Am: 0,
  rnSt1Pm: 0,
  rnSt2Am: 0,
  rnSt2Pm: 0,
  rnSt3Am: 0,
  rnSt3Pm: 0,
  // 최저 최고온도
  taMin1: 0,
  taMax1: 0,
  taMin2: 0,
  taMax2: 0,
  taMin3: 0,
  taMax3: 0,
  // 하늘 상태
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
      // 단기예보
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${SECRET_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${nowDate}&base_time=0200&nx=${x}&ny=${y}`
    );
    if (res.data.response.body) {
      // 오늘의 날씨
      let temp = res.data.response.body.items.item;
      let totalForecast = temp.reduce(
        (acc: Forecast, item: ApiData) => {
          // 오늘 날짜의 데이터만 필터링
          if (item.fcstDate !== item.baseDate) return acc;

          // 최저 및 최고 온도는 바로 할당
          if (item.category === "TMN") acc.TMN = item.fcstValue;
          if (item.category === "TMX") acc.TMX = item.fcstValue;

          // 짝수 시간대(2시간 간격) 조건 처리
          const isEvenTime = parseInt(item.fcstTime.slice(0, -2)) % 2 === 0;

          // 각 카테고리별로 짝수 시간대의 데이터를 배열에 추가
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

      setTodayWeather(temp2);

      // 3일후까지의 날씨
      let temp3 = res.data.response.body.items.item.slice(260);
      // 필요한 카테고리 값만 추출
      let temp4 = temp3.filter(
        (i: ApiData) =>
          ["TMX", "TMN"].includes(i.category) ||
          (["0600", "1800"].includes(i.fcstTime) &&
            ["SKY", "POP"].includes(i.category))
      );
      temp4.forEach((i: ApiData) => {
        // 시간대 및 카테고리별로 데이터 처리
        const isAm = i.fcstTime === "0600";
        const isPm = i.fcstTime === "1800";
        const isTomorrow = Number(nowDate) + 1;

        // 시간대에 따른 하늘 상태(SKY)와 강수 확률(POP) 처리
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

        // 기온 처리 (최저, 최고 기온)
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

// 중기날씨api는 오늘기준으로 4일후부터 제공하기때문에
// 1,2,3일후 날씨는 단기예보api를 사용해서 따로 받아와야함
export async function getWeekendWeatherData(wkRegion: string) {
  try {
    // 중기날씨

    let date = formattedDate() + "0600";
    const res = await axios.get(
      `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=${SECRET_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${wkRegion}&tmFc=${date}`
    );
    console.log(res.data);
    if (res.data.response.body) {
      return res.data.response.body.items.item[0];
    }
  } catch (err) {
    console.error(err);
  }
}
// 중기기온을 받아오는 메소드
export async function getWeekendTempData(wkRegion: string | null) {
  try {
    let date = formattedDate() + "0600";

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
// POP-강수확률,PTY-강수형태,PCP-강수량,REH-습도,SKY-하늘상태,TMP-기온
// 필터처리할때 fcstDate fcstTime category 가져올값  fcstValue
// 데이터 0-99: 0200~ 1100 100-199: 1100~1900 200-278: 1900- 0100
// 하루 일보 4시, 6시 , 8시 , 10시 , 12시, 14시 , 16시 , 18시 , 20시 , 22시
