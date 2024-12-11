import { useReducer } from "react";
const reducer = (state, action) => {
  switch (action.type) {
    case "PLUS":
      return state + 1;
    case "MINUS":
      return state - 1;
  }
};
const Reducer = () => {
  const [number, dispatch] = useReducer(reducer, 0);
  return (
    <div>
      {number}
      <button onClick={() => dispatch({ type: "PLUS" })}>+</button>
      <button onClick={() => dispatch({ type: "MINUS" })}>-</button>
    </div>
  );
};

export default Reducer;
