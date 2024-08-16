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
    <div className="max-[640px]:text-sm border-2 rounded-md ">
      <div className="flex justify-center max-[640px]:flex-col max-[640px]:items-center">
        {WeekendWeather.day}
        <div className="px-4 max-[640px]:px-0 text-center">
          {WeekendWeather.taMin}℃ / {WeekendWeather.taMax}℃
        </div>
      </div>
      <div className="flex  h-full items-center justify-center max-[640px]:flex-col ">
        <div className="flex  items-center mx-2 justify-center max-[640px]:flex-col">
          <p>오전</p>

          <img
            src={`/${icon.amIcon}.png`}
            className="rounded-xl p-1 object-contain w-1/3 max-[640px]:w-full"
            alt=""
          />
          <p>{WeekendWeather.rnStAm}%</p>
        </div>
        <div className="flex items-center mx-2 justify-center max-[640px]:flex-col">
          <p>오후</p>

          <img
            src={`/${icon.pmIcon}.png`}
            className="rounded-xl p-1 object-contain w-1/3 max-[640px]:w-full"
            alt=""
          />
          <p>{WeekendWeather.rnStPm}%</p>
        </div>
      </div>
    </div>
  );
};

export default WeekendShow;
