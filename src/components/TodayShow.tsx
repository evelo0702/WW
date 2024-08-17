import { todayWeather } from "../model/types";
interface Props {
  item: todayWeather;
}
const TodayShow: React.FC<Props> = ({ item }) => {
  let Time = item.TIME.slice(0, -2);

  return (
    <div className="flex w-5/6">
      <div className="flex flex-col items-center">
        <p>{Time}시</p>
        <img
          src={`/${item.ICON}.png`}
          className="rounded-xl h-1/5 md:h-1/2 p-1"
          alt=""
        />
        <div className="flex my-2">
          {parseInt(item.TMP) >= 28 ? (
            <p className="text-red-700">{item.TMP}℃</p>
          ) : parseInt(item.TMP) < 28 && parseInt(item.TMP) > 18 ? (
            <p className="">{item.TMP}℃</p>
          ) : (
            <p className="text-blue-700">{item.TMP}℃</p>
          )}
        </div>
        <div className="my-2">{item.POP}%</div>
        <div className="flex my-2">{item.REH}</div>
      </div>
    </div>
  );
};

export default TodayShow;
