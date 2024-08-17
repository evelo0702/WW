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
      <div className="border-4  rounded-md md:h-1/3 h-1/3 flex m-2 items-center max-[460px]:text-sm">
        <div>
          <div className="flex w-5/6 text-lg max-[570px]:invisible">
            <div className="flex flex-col items-center">
              <p className="invisible">시</p>
              <img
                src={`/Rainy.png`}
                className="invisible rounded-xl h-2/3 md:h-1/2 p-1"
                alt=""
              />
              <div className="flex my-2">
                <p>기온</p>
              </div>
              <div className="my-2">강수확률</div>
              <div className="flex my-2">습도</div>
            </div>
          </div>
        </div>
        {TodayWeather.map((item) => (
          <div>
            <TodayShow item={item} key={item.ID} />
          </div>
        ))}
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
