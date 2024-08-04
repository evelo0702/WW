import "./App.css";
import RecWear from "./components/RecWear";
import ShowWeather from "./components/ShowWeather";

function App() {
  return (
    <div className="flex md:flex-row flex-col w-full px-10 h-screen">
      <ShowWeather />
      <RecWear />
    </div>
  );
}

export default App;
