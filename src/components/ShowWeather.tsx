import { todayWeather } from "../model/types";
import { getIcon } from "../utils/getIcon";
import SearchAddress from "./SearchAddress";
import { totalAddress } from "./SearchModal";
import TodayShow from "./TodayShow";
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
  if (TodayWeather.length > 1) {
    console.log(TodayWeather);
    getIcon(TodayWeather);
  }

  return (
    <div className="p-5 md:h-95vh h-3/5 md:w-2/3 w-full flex flex-col">
      <div className="flex w-full md:h-1/5 h-1/3  m-2 max-[460px]:h-1/5">
        <div className="w-1/2">
          <div className="h-1/2 flex ">
            <div className="w-full">
              <img
                src="/Logo.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="h-1/2 font-dongle text-center md:justify-center flex max-[460px]:text-sm ">
            <div className="w-full flex flex-col ">
              <div className="">
                <SearchAddress setLocation={setLocation} />
              </div>
              <div>{regionName}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:w-1/2 w-1/3 h-full items-center justify-center overflow-hidden">
          {TodayWeather.length > 1 && (
            <div className="md:w-1/2 w-3/4 overflow-hidden rounded-xl">
              <img
                src={`/${TodayWeather[0].ICON}.png`}
                className="object-cover w-full h-full"
                alt=""
              />
            </div>
          )}
          <div className="flex justify-around max-[460px]:text-sm">
            {TodayWeather.length > 1 ? (
              <p>
                {TodayWeather[0].TMN}℃ / {TodayWeather[0].TMX}℃
              </p>
            ) : (
              <p>최저℃ / 최고℃ </p>
            )}
          </div>
        </div>
      </div>
      <div className="border-4  rounded-md md:h-1/4 h-1/2 flex m-2 items-center max-[460px]:text-sm">
        {/* <div className="flex w-2/3 lg:text-lg lg:visible invisible flex-col">
          <div className="flex flex-col items-center  bg-blue-400">
            <p className="mb-2">기온</p>
            <p>강수확률</p>
            <p className="mb-2">습도</p>
          </div>
        </div> */}
        <div className="flex w-5/6 text-lg max-[570px]:invisible">
          <div className="flex flex-col items-center">
            <p className="invisible">{}시</p>
            <img
              src={`/Sunny.png`}
              className="rounded-xl h-2/3 md:h-1/2 p-1 invisible"
              alt=""
            />
            <div className="flex">
              <p className="">기온</p>
            </div>
            <div>강수 확률</div>
            <div className="flex">습도</div>
          </div>
        </div>
        {TodayWeather.map((item) => (
          <TodayShow item={item} key={item.ID} />
        ))}
      </div>
      <div className="bg-indigo-400 flex-grow  md:h-1/3 h-1/2 flex m-2">
        주간 날씨
      </div>
    </div>
  );
};

export default ShowWeather;
