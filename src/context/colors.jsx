import React from "react";
import { v4 } from "uuid";

const ColorContext = React.createContext();

export const useColors = () => React.useContext(ColorContext);

function ColorProvider({ children }) {
  const [colors, setColors] = React.useState(colorData);

  const remove = (id) => setColors(colors.filter((color) => color.id !== id));
  const rateColor = (id, rating) => {
    setColors(
      colors.map((color) => (color.id === id ? { ...color, rating } : color))
    );
  };
  const addColors = (color) => {
    setColors([...colors, { ...color, rating: 0, id: v4() }]);
  };
  return (
    <ColorContext.Provider value={{ colors, remove, rateColor, addColors }}>
      {children}
    </ColorContext.Provider>
  );
}
export default ColorProvider;
const colorData = [
  {
    id: "0175d1f0-a8c6-41bf-8d02-df5734d829a4",
    title: "ocean at dusk",
    color: "#00c4e2",
    rating: 5,
  },
  {
    id: "83c7ba2f-7392-4d7d-9e23-35adbe186046",
    title: "lawn",
    color: "#26ac56",
    rating: 3,
  },
  {
    id: "a11e3995-b0bd-4d58-8c48-5e49ae7f7f23",
    title: "bright red",
    color: "#ff0000",
    rating: 0,
  },
];
