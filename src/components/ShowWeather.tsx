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
      if (time > 4) {
        return (
          parseInt(i.TIME.slice(0, -2)) === time ||
          parseInt(i.TIME.slice(0, -2)) === time - 1
        );
      } else {
        return i.TIME === "0400";
      }
    });

    setCurWx(data);
  };
  if (TodayWeather.length > 1) {
    getIcon(TodayWeather);
  }
  useEffect(() => {
    getCurWxData(TodayWeather);
  }, [TodayWeather]);
  return (
    <div className="md:h-85vh w-full flex flex-col">
      <div className="flex w-full md:h-1/5 m-2 h-48">
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

          <div className="h-1/3 font-dongle text-center md:justify-center flex max-[460px]:text-sm ">
            <div className="w-full flex flex-col">
              <div className="">
                <SearchAddress setLocation={setLocation} />
              </div>
              <div>{regionName}</div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col md:w-1/2 w-1/3 h-full items-center justify-center overflow-hidden ">
          {TodayWeather.length > 1 && curWx && (
            <div className="md:w-1/2 w-3/4 h-4/6 max-[760px]:h-1/2">
              <img
                src={`/${curWx[0].ICON}.webp`}
                className="w-full h-full rounded-xl"
                alt=""
              />
            </div>
          )}
          <div className="flex flex-col justify-around max-[460px]:text-sm">
            {curWx && <p className="text-center">{curWx[0].TMP}℃</p>}
            {TodayWeather.length > 1 ? (
              <p className="text-gray-500">
                {TodayWeather[0].TMN}℃ / {TodayWeather[0].TMX}℃
              </p>
            ) : (
              <p>최저℃ / 최고℃ </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-4 rounded-md flex m-2 items-center relative max-[550px]:text-sm max-[380px]:text-xs max-[480px]:h-48">
        <div className="grid h-full p-3 grid-cols-11 ">
          <div className="flex border rounded-lg shadow-md h-full">
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
