import axios from "axios";
export async function getWeatherData(
  nowDate: string,
  secret_key: string,
  x: number,
  y: number
) {
  const res = await axios.get(
    `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${secret_key}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${nowDate}&base_time=0600&nx=${x}&ny=${y}`
  );

  console.log(res.data.response.body.items.item);
}
