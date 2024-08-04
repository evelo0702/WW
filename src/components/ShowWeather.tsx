import React from "react";

const ShowWeather = () => {
  return (
    <div className="bg-red-400 p-5 md:h-screen h-3/5 md:w-2/3 w-full flex flex-col">
      <div className="flex-grow md:h-1/6 h-1/3 flex m-2">
        <div className="bg-sky-100 w-1/2">현재날씨</div>
        <div className="bg-red-200 w-1/2">지역선택 </div>
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
