import { useEffect, useState } from "react";
import GptChat from "./GptChat";
import { changeGptComment } from "../utils/changeGptComment";

interface Props {
  summary: string;
}
const RecWear: React.FC<Props> = ({ summary }) => {
  const [comment, setComment] = useState("");
  const [ansGpt, setAns] = useState<string[]>([]);
  useEffect(() => {
    if (comment) {
      let temp = changeGptComment(comment);
      setAns(temp);
    }
  }, [comment]);

  return (
    <div className="h-full w-full flex flex-col max-[460px]:text-sm">
      <p className="text-4xl text-center my-4">오늘의 날씨 from AI </p>
      {summary && <GptChat summary={summary} setComment={setComment} />}

      <div className="md:h-1/4 h-1/4 flex items-center p-4 border-y-2">
        {ansGpt[0] && <p> 날씨 요약: {ansGpt[0]}</p>}
      </div>
      <div className="h-1/4 flex items-center p-4 ">
        {ansGpt[1] && <p> 날씨에 맞는 의상: {ansGpt[1]}</p>}
      </div>
      <div className="max-[768px]:flex md:h-1/4 flex-grow flex border-2 rounded-md p-4 items-center">
        <div className=" md:h-1/3 w-1/2 md:w-full text-center flex flex-col justify-center">
          {ansGpt[2] &&
            ansGpt[2].split(",").map((i, index) => <div key={index}>{i}</div>)}
        </div>
        <div className=" md:h-1/3 w-1/2 md:w-full text-center flex flex-col justify-center">
          {ansGpt[3] &&
            ansGpt[3].split(",").map((i, index) => <div key={index}>{i}</div>)}
        </div>
      </div>
    </div>
  );
};

export default RecWear;
