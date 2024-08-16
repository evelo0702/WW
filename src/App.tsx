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
  todayWeather,
  twodayWeather,
  weekendWeatherData,
} from "./model/types";
import { getRegionCode } from "./data/regionCode";
import { changeWeekendWeather } from "./utils/changeWeatherData";
import Loader from "./components/Loader";

const appKey = import.meta.env.VITE_KAKAO_KEY;
function App() {
  // kakao api script 연결
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
  const [twodayWeather, settwodayWeather] = useState({} as twodayWeather);
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
  useEffect(() => {
    // 날씨를 받아오기위해 날짜를 포맷에 맞게 세팅
    setCurrentDate(formattedDate());
    // 현재 위치의 위도,경도를 불러오는 메소드
    searchDefaultLocation();
  }, []);

  // 위치 변경될때만 날씨 정보를 호출
  useEffect(() => {
    if (currentDate && location) {
      // 날씨 정보를 api로부터 받아오는 메소드
      getTodayWeatherData(
        currentDate,
        location.x,
        location.y,
        setTodayWeather,
        settwodayWeather
      );
      let regionName = location.regionName;
      if (regionName) {
        setRegionCode(getRegionCode("today", regionName));
      }
    }
  }, [location, currentDate]);

  const getWeekendData = async () => {
    if (regionCode) {
      const result = await getWeekendWeatherData(regionCode);

      if (location.regionName) {
        const result2 = await getWeekendTempData(
          getRegionCode("weekend", location.regionName)
        );
        if (result2) {
          let temp = { ...result, ...twodayWeather, ...result2 };

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

  // 현재위치에따른location값을 불러오는 메소드
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

  const filterWeather = (todayWeather: todayWeather[]) => {
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
    3. 상의를 설명없이 추천하는 리스트만 보여줘
    4. 하의를 설명없이 추천하는 리스트만 보여줘
    3,4에서 - 이 표시 적지마
    예를들면 
    1. 이 날씨는 강수확률이 없고 최저 온도는 25.0도, 최고 온도는 35.0도로 높은 온도가 예상됩니다. 또한 습도가 높아서 습한 느낌이 느껴질 것입니다.
2. 이 날씨에는 가볍고 시원한 옷을 입는 것이 좋습니다. 얇고 통기성이 좋은 소재의 옷을 선택하고, 반팔 티셔츠나 얇은 셔츠, 반바지나 면바지를 입는 것이 적합할 것입니다.
3. 반팔 티셔츠, 얇은 셔츠, 나시티, 폴로 셔츠, 민소매 탑
4. 반바지, 면바지, 린넨 바지, 조거 팬츠 
딱 이렇게 적어줘
    `;
    setSummary(total);
  };

  useEffect(() => {
    if (todayWeather) {
      filterWeather(todayWeather);
    }
  }, [todayWeather]);
  return (
    <div>
      {todayWeather.length > 1 ? (
        <div className="">
          <div
            className="flex md:flex-row flex-col px-10 md:h-95vh text-2xl max-w-screen-xl mx-auto
      max-[380px]:text-lg  "
          >
            <div className="h-5/6">
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

            <div className="md:h-full w-full ms-4 ">
              <RecWear summary={summary} />
            </div>
          </div>
          <div className="flex justify-end px-10 items-center text-xl">
            <p className="me-10">Made by EVELO</p>
            <p className="text-sm">Weather-Icon by lexamer </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          <Loader />
          <p className="ms-4 text-3xl">API DATA IS LOADING</p>
        </div>
      )}
    </div>
  );
}

export default App;
