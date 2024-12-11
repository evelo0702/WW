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
  // 지역명을 slice해서 해당값으로 getRegionCode를 호출해서 지역코드를 얻어오는 메소드가 필요함

  return (
    <div className="md:h-95vh w-full flex flex-col">
      <div className="flex w-full md:h-1/5 m-2 h-48">
        <div className="w-1/2">
          <div className="h-2/3 flex ">
            <img
              src="/Logo.png"
              alt=""
              className="h-full w-full object-cover"
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

        <div className="pt-4 flex flex-col md:w-1/2 w-1/3 h-full items-center justify-center overflow-hidden">
          {TodayWeather.length > 1 && curWx && (
            <div className="md:w-1/2 w-3/4 overflow-hidden rounded-xl">
              <img
                src={`/${curWx[0].ICON}.png`}
                className="w-full h-full"
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
      {/* <div className="border-4  rounded-md flex m-2 items-center max-[480px]:text-sm max-[480px]:h-48">
        <div
          className="
        grid h-full p-3
         grid-cols-10"
        >
          {TodayWeather.map((item, index) => (
            <div>
              <TodayShow item={item} key={item.ID} index={index} />
            </div>
          ))}
        </div>
      </div> */}

      <div className="border-4 rounded-md flex m-2 items-center max-[480px]:text-sm max-[480px]:h-48">
        <div className="grid h-full p-3 grid-cols-10 gap-2">
          {TodayWeather.map((item) => (
            <div key={item.ID}>
              <TodayShow item={item} />
            </div>
          ))}
        </div>
        <div className="text-sm flex flex-col w-20 h-full justify-end">
          <p className="border-b-2">온도</p>
          <p className="border-b-2">강수확률</p>
          <p className="border-b-2">습도</p>
        </div>
      </div>

      <div
        className="
        grid grid-cols-1 md:h-1/2 h-1/3 p-3
        sm:grid-cols-2  max-[640px]:grid-cols-7 
      "
      >
        {WeekendWeather.map((item, index) => (
          <div
            key={item.day}
            className={` ${
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
