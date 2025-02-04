import { useEffect, useState } from "react";
import { todayWeather, weekendWeatherData } from "../model/types";
import { getIcon } from "../utils/getIcon";
import SearchAddress from "./SearchAddress";
import { totalAddress } from "./SearchModal";
import TodayShow from "./TodayShow";
import WeekendShow from "./WeekendShow";
interface Props {
  regionName: string;
  setLocation: React.Dispatch<React.SetStateAction<totalAddress>>;
  TodayWeather: todayWeather[];
  WeekendWeather: weekendWeatherData[];
  regionCode: string | null;
}
const ShowWeather: React.FC<Props> = ({
  regionName,
  setLocation,
  TodayWeather,
  WeekendWeather,
}) => {
  let [curWx, setCurWx] = useState<todayWeather[]>();
  const getCurWxData = (TodayWeather: todayWeather[]) => {
    let time = new Date().getHours();
    let data = TodayWeather.filter((i) => {
      if (time > 6) {
        return (
          parseInt(i.TIME.slice(0, -2)) === time ||
          parseInt(i.TIME.slice(0, -2)) === time - 1
        );
      } else {
        return i.TIME === "0600";
      }
    });

    if (data.length === 0) {
      console.warn("데이터가 없습니다. 가장 최근 데이터 사용.");
      data = [TodayWeather[TodayWeather.length - 1]];
    }

    setCurWx(data);
  };
  if (TodayWeather.length > 1) {
    getIcon(TodayWeather);
  }
  useEffect(() => {
    getCurWxData(TodayWeather);
  }, [TodayWeather]);
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex w-full  m-2 h-1/5 md:mb-4">
        <div className="w-1/2">
          <div className="h-2/3 flex ">
            <img
              src="/Logo.webp"
              alt=""
              className="h-full w-full object-cover"
              loading="eager"
              width={500}
              height={500}
            />
          </div>

          <div className="h-1/3 font-dongle text-center md:justify-center flex max-[460px]:text-xl">
            <div className="w-full flex flex-col">
              <div className="">
                <SearchAddress setLocation={setLocation} />
              </div>
              <div>{regionName}</div>
            </div>
          </div>
        </div>

        <div className="pt-4  flex flex-col md:w-1/2 w-1/2  items-center justify-center overflow-hidden ">
          {TodayWeather.length > 1 && curWx && (
            <div className="md:w-1/3 w-1/2 h-1/3 md:h-1/3">
              <img
                src={`/${curWx[0].ICON}.webp`}
                className="w-full h-full rounded-xl"
                alt=""
              />
            </div>
          )}
          <div className="flex flex-col justify-around ">
            {curWx && <p className="text-center">{curWx[0].TMP}℃</p>}
            {TodayWeather.length > 1 && (
              <div className="text-gray-500 md:flex">
                <p className="md:me-4">최저: {TodayWeather[0].TMN}℃ </p>
                <p>최고: {TodayWeather[0].TMX}℃</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:border-4 md:p-4 w-full mb-4 rounded-md flex items-center relative max-[550px]:text-xl  max-[400px]:h-48">
        <div className="grid h-full grid-cols-7">
          <div className="flex border rounded-lg shadow-md h-full items-center">
            <div className="flex flex-col items-center">
              <p>시간</p>
              <img src={`/Clear.webp`} className="rounded-xl p-1" alt="" />
              <div className="flex my-2">
                <p>온도</p>
              </div>
              <div className="my-2">강수</div>
              <div className="flex my-2">습도</div>
            </div>
          </div>
          {TodayWeather.map((item) => (
            <div key={item.ID}>
              <TodayShow item={item} />
            </div>
          ))}
        </div>
      </div>

      <div
        className="
        grid grid-cols-1 md:h-1/2 h-1/3 
        sm:grid-cols-2  max-[640px]:grid-cols-7  
      "
      >
        {WeekendWeather.map((item, index) => (
          <div
            key={item.day}
            className={`  ${
              index === WeekendWeather.length - 1
                ? "sm:col-span-2"
                : "col-span-1"
            } `}
          >
            <WeekendShow WeekendWeather={item} key={item.day} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowWeather;
