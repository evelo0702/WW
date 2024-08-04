import React from "react";

const RecWear = () => {
  return (
    <div className="bg-sky-400  p-5 md:h-screen md:w-1/3 w-full h-2/5 flex flex-col">
      <div className="bg-red-400 mb-10 md:h-1/4 h-1/4 md:mb-10">코멘트</div>
      <div className="max-[768px]:flex md:h-full flex-grow ">
        <div className="bg-teal-400 md:h-1/5 w-1/3 md:w-full">모자</div>
        <div className="bg-yellow-100 md:h-2/5 w-1/3 md:w-full">상의</div>
        <div className="bg-green-400 md:h-2/5 w-1/3 md:w-full">하의</div>
      </div>
    </div>
  );
};

export default RecWear;
