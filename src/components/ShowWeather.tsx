import { todayWeather } from "../model/types";
import SearchAddress from "./SearchAddress";
import { totalAddress } from "./SearchModal";

interface Props {
  regionName: string;
  setLocation: React.Dispatch<React.SetStateAction<totalAddress>>;
  TodayWeather: todayWeather[];
}
const ShowWeather: React.FC<Props> = ({
  regionName,
  setLocation,
  TodayWeather,
}) => {
  const getIcon = () => {
    if (TodayWeather.length > 1) {
      for (let i = 0; i < TodayWeather.length; i++) {
        if (parseInt(TodayWeather[i].PTY) > 0) {
          switch (TodayWeather[i].PTY) {
            case "1":
              TodayWeather[i].ICON = "Rainy";
              break;
            case "2":
              TodayWeather[i].ICON = "Sleet";
              break;
            case "3":
              TodayWeather[i].ICON = "Snowy";
              break;
            case "4":
              TodayWeather[i].ICON = "Rainy";
              break;
          }
        } else if (parseInt(TodayWeather[i].SKY) <= 5) {
          TodayWeather[i].ICON = "Clear";
        } else if (
          5 < parseInt(TodayWeather[i].SKY) &&
          parseInt(TodayWeather[i].SKY) <= 8
        ) {
          TodayWeather[i].ICON = "PartlyCloudy";
        } else if (parseInt(TodayWeather[i].TIME) >= 2000) {
          TodayWeather[i].ICON = "Cloudy";
        } else {
          TodayWeather[i].ICON = "Sunny";
        }
      }
    }
  };
  if (TodayWeather.length > 1) {
    console.log(TodayWeather);
    getIcon();
  }

  return (
    <div className="p-5 md:h-95vh h-3/5 md:w-2/3 w-full flex flex-col">
      <div className="flex-grow md:h-1/6 h-1/3 flex m-2">
        <div className="w-2/3">
          <div className="h-1/2 flex">
            <img src="/Logo.png" alt="" className="h-full w-4/5 object-cover" />
          </div>
          <SearchAddress setLocation={setLocation} />
        </div>
        <div className="bg-sky-100 w-2/3 p-3 font-dongle text-center md:justify-center flex flex-col">
          <div>{regionName}</div>

          <div className="flex justify-around max-[380px]:flex-col">
            {TodayWeather.length > 1 ? (
              <p>
                {TodayWeather[0].TMN}℃ / {TodayWeather[0].TMX}℃
              </p>
            ) : (
              <p>최저℃ / 최고℃ </p>
            )}
          </div>
          {TodayWeather.length > 1 && (
            <img
              src={`/${TodayWeather[0].ICON}.png`}
              className="rounded-xl w-3/5 md:h-3/5 h-1/2 max-[400px]:h-2/5 mx-auto my-auto flex-grow overflow-hidden"
              alt=""
            />
          )}
        </div>
      </div>
      <div className="bg-green-400 flex-grow md:h-1/3 h-1/2 flex m-2 ">
        오늘의 날씨
      </div>
      <div className="bg-indigo-400 flex-grow  md:h-1/3 h-1/2 flex m-2">
        주간 날씨
      </div>
    </div>
  );
};

export default ShowWeather;
