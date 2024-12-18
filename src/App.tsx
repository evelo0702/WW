import { useEffect, useState } from "react";
import { formattedDate } from "./utils/formattedDate";
import {
  getTodayWeatherData,
  getWeekendTempData,
  getWeekendWeatherData,
} from "./utils/getWeatherData";
import { dfs_xy_conv } from "./utils/changeXYcode";
import { xyToAddress } from "./utils/xyToAddress";
import RecWear from "./components/RecWear";
import ShowWeather from "./components/ShowWeather";
import {
  Location,
  threeDayWeather,
  todayWeather,
  weekendWeatherData,
} from "./model/types";
import { getRegionCode } from "./data/regionCode";
import { changeWeekendWeather } from "./utils/changeWeatherData";
import Loader from "./components/Loader";

const appKey = import.meta.env.VITE_KAKAO_KEY;
function App() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const [todayWeather, setTodayWeather] = useState([{} as todayWeather]);
  const [threedayWeather, setthreedayWeather] = useState({} as threeDayWeather);
  const [weekendWeather, setweekendWeather] = useState(
    [] as weekendWeatherData[]
  );
  const [regionCode, setRegionCode] = useState<string | null>("");
  const [currentDate, setCurrentDate] = useState("");
  const [location, setLocation] = useState<Location>({
    lat: 0,
    lng: 0,
    x: 0,
    y: 0,
  });
  const [summary, setSummary] = useState("");
  const [gender, setGender] = useState("");
  useEffect(() => {
    setCurrentDate(formattedDate());
    searchDefaultLocation();
  }, []);

  useEffect(() => {
    if (currentDate && location) {
      getTodayWeatherData(
        currentDate,
        location.x,
        location.y,
        setTodayWeather,
        setthreedayWeather
      );
      let regionName = location.regionName;
      if (regionName) {
        setRegionCode(getRegionCode("", regionName));
      }
    }
  }, [location, currentDate]);

  const getWeekendData = async () => {
    if (regionCode) {
      const result = await getWeekendWeatherData(regionCode);
      if (location.regionName) {
        const result2 = await getWeekendTempData(
          getRegionCode("weekendTemp", location.regionName)
        );
        if (result2) {
          let temp = { ...result, ...threedayWeather, ...result2 };
          let filter = changeWeekendWeather(temp);
          setweekendWeather(filter);
        }
      }
    }
  };

  useEffect(() => {
    if (todayWeather) {
      getWeekendData();
    }
  }, [todayWeather]);
  const searchDefaultLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      let temp = { latitude: 0, longitude: 0 };
      temp.latitude = Number(pos.coords.latitude);
      temp.longitude = Number(pos.coords.longitude);
      let totalLoc = dfs_xy_conv("toXY", temp.latitude, temp.longitude);
      let res = await xyToAddress(totalLoc);
      setLocation(res);
    });
  };

  const filterWeather = (todayWeather: todayWeather[], gender: string) => {
    let rainy =
      todayWeather.filter((item) => Number(item.POP) >= 60).length > 0
        ? "강수확률 높음"
        : "강수확률 없음";

    let temp = `최저온도 ${todayWeather[0].TMN} 최고온도 ${todayWeather[0].TMX}`;

    let humidity =
      todayWeather.filter((item) => Number(item.REH) > 60).length > 0
        ? "습함"
        : "습하지않음";
    let total = `${rainy} , ${temp} , ${humidity} 
    이날씨에 대한 설명을 다음과 같은 양식을 꼭 지켜서 말해줘 
    
    1. 이 날씨에 대한 자세한 설명을 해줘
    2. 이 날씨에 어떤 의상을 입어야할지 자세히 설명해줘(구체적인 추천 의상은 없어야돼)
    3. 중복없이 상의만 설명없이 ${gender}을 기준으로 추천하는 옷 리스트외엔 아무것도 적지말고 보여줘 예를들어 상의:??이렇게 적지마 그리고 - 이표시도 적지마
    4. 중복없이 하의만 설명없이 ${gender}을 기준으로 추천하는 옷 리스트외엔 아무것도 적지말고 보여줘
    
아래와같이 3번은 중복없이 상의만 적어주고 4번은 중복없이 하의만 적어줘 
3. ? , ? , ? ,? 
4. ? , ? ,? ,? 
이런식으로 적어주고 그리고 3,4에서 쓸데없는 기호나 상의: 이런거 절대 적지말고 영어로도 적지말고 중복되지않는 최소 3개씩은 추천해주고 위에 1,2,3,4번 모두 꼭 적어줘
    `;
    setSummary(total);
  };

  useEffect(() => {
    if (todayWeather && gender) {
      filterWeather(todayWeather, gender);
    }
  }, [todayWeather, gender]);
  return (
    <div className="h-90vh ">
      {todayWeather.length > 1 ? (
        <div>
          <div
            className="flex md:flex-row flex-col px-10 md:h-90vh text-2xl max-w-screen-xl mx-auto
      max-[380px]:text-lg"
          >
            <div className="h-5/6 w-full md:w-2/3 md:me-4">
              {location.regionName && (
                <ShowWeather
                  regionCode={regionCode}
                  regionName={location.regionName}
                  setLocation={setLocation}
                  TodayWeather={todayWeather}
                  WeekendWeather={weekendWeather}
                />
              )}
            </div>

            <div className="md:h-85vh w-full md:w-1/3">
              <RecWear
                summary={summary}
                setGender={setGender}
                gender={gender}
              />
            </div>
          </div>
          <div className="flex justify-end px-10 items-center text-xl">
            <p className="me-10">Made by EVELO</p>
            <p className="text-sm">Weather-Icon by lexamer </p>
          </div>
        </div>
      ) : (
        <div className="w-full h-95vh  flex flex-col justify-center items-center">
          <img
            src="/Logo.webp"
            alt=""
            className="rounded-xl mb-8"
            loading="eager"
          />
          <Loader text="API DATA IS LOADING" mode="main" />
        </div>
      )}
    </div>
  );
}

export default App;
