import { useEffect, useState } from "react";
import { weekendWeatherData } from "../model/types";
import { getWeekendWeatherIcon } from "../utils/getIcon";

interface Props {
  WeekendWeather: weekendWeatherData;
}
interface Icon {
  amIcon: string;
  pmIcon: string;
}
const WeekendShow: React.FC<Props> = ({ WeekendWeather }) => {
  const [icon, setIcon] = useState({} as Icon);
  useEffect(() => {
    let temp = getWeekendWeatherIcon(WeekendWeather);
    setIcon(temp);
  }, [WeekendWeather]);

  return (
    <div className="max-[640px]:text-base border-2 rounded-md h-full flex-col items-center justify-center">
      <div className="flex justify-center max-[640px]:flex-col max-[640px]:items-center">
        {WeekendWeather.day}
        <div className="px-4 max-[640px]:px-0 text-center max-[400px]:text-xs">
          {WeekendWeather.taMin}℃ / {WeekendWeather.taMax}℃
        </div>
      </div>
      <div className="flex items-center justify-center max-[640px]:flex-col ">
        <div className="flex  items-center md:mx-2 justify-center max-[640px]:flex-col">
          오전<p>{WeekendWeather.rnStAm}%</p>
          <img
            src={`/${icon.amIcon}.webp`}
            className="rounded-xl p-1 md:object-contain w-1/3 max-[640px]:w-full"
            alt=""
          />
        </div>
        <div className="flex items-center mx-2 justify-center max-[640px]:flex-col">
          오후<p>{WeekendWeather.rnStPm}%</p>
          <img
            src={`/${icon.pmIcon}.webp`}
            className="rounded-xl p-1 md:object-contain w-1/3 max-[640px]:w-full"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default WeekendShow;
