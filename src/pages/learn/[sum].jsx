import React from "react";
import {
  CircularProgress,
  Paper,
  Typography,
  IconButton,
  Divider,
} from "@material-ui/core";
import { Star, Cancel } from "@material-ui/icons";
import { v4 } from "uuid";
import { useColors } from "../../context/colors";

const UseStar = ({ selected = false, handleclick = (f) => f }) => (
  <Star htmlColor={selected ? "red" : "gray"} onClick={handleclick} />
);
const StarRating = ({
  stars = 5,
  sendClicked = (f) => f,
  rate = 3,

  style = {},
  ...props
}) => {
  return (
    <div style={{ padding: 8, border: "1px ", ...style }} {...props}>
      {[...Array(stars)].map((star, i) => (
        <UseStar
          key={i}
          selected={rate > i}
          handleclick={() => sendClicked(i + 1)}
        />
      ))}
    </div>
  );
};

export default function ColorApp() {
  return (
    <>
      <Paper className="w-5/6 mx-auto my-10 p-6">
        <ColorList />
      </Paper>
      <Divider />
      <Paper className="mx-auto w-64 p-2">
        <AddColorForm />
      </Paper>
    </>
  );
}
const ColorList = () => {
  const { colors } = useColors();

  if (!colors.length)
    return (
      <div className="text-center">
        {" "}
        <CircularProgress fontSize="2rem" />{" "}
      </div>
    );

  return (
    <div className="flex flex-row justify-center  ">
      {colors.map((color) => (
        <PureColor key={color.id} {...color} />
      ))}
    </div>
  );
};

const Color = ({ title, color, rating, id }) => {
  const { remove, rateColor } = useColors();
  console.log("rendering color", id);
  return (
    <section className="w-50 mx-2 p-3">
      <h1>{title}</h1>
      <IconButton onClick={() => remove(id)}>
        <Cancel color="secondary" size="small" />
      </IconButton>
      <div style={{ height: 50, backgroundColor: color }} />
      <StarRating rate={rating} sendClicked={(rate) => rateColor(id, rate)} />
    </section>
  );
};
const PureColor = React.memo(Color, (prevProps, nextProps) =>
  console.log(prevProps.id === nextProps.id)
);
function AddColorForm() {
  const [title, setTitle] = React.useState("");
  const [color, setColor] = React.useState("#000000");
  const { addColors } = useColors();
  const submit = (e) => {
    e.preventDefault();
    addColors({ title, color });
    setTitle("");
    setColor("#000");
  };
  return (
    <form onSubmit={submit}>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        type="text"
        placeholder="color title..."
        required
      />
      <input
        value={color}
        onChange={(event) => setColor(event.target.value)}
        type="color"
        required
      />
      <button>ADD</button>
    </form>
  );
}

function izzy() {
  let nums = "0123456789abcdefghijklmnopqrstuvwxyz";
  const randomGen = () => Math.floor(Math.random() * nums.length);
  return function () {
    let arr = nums.split("");
    let output = "";
    for (let i = 0; i < 4; i++) {
      output += arr[randomGen()];
    }
    return output;
  };
}
const izz = izzy();
const izza = izzy();
const izzb = izzy();
const izzc = izzy();
let jwt = `${izz()}-${izza()}-${izzb()}-${izzc()}`;
console.log(jwt);
