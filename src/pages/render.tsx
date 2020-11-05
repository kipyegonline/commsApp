import React from "react";
import {
  List,
  ListItemIcon,
  ListItem,
  ListItemText,
  CircularProgress,
  Divider,
} from "@material-ui/core";
//import { FixedSizeList } from "react-window";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import Fetch from "../lib/api/helperHooks";

const useStyles = makeStyles({
  root: {
    width: 500,
  },
});

export function SimpleBottomNavigation() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
      <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
      <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
    </BottomNavigation>
  );
}

function RenderProps() {
  let [users, setUsers] = React.useState([]);
  React.useEffect(() => {
    const users =
      globalThis.window &&
      JSON.parse(localStorage.getItem("sondikoList") as string);
    setTimeout(() => setUsers(users), 3000);
  }, []);

  console.log(users);
  return (
    <div>
      <p>Setting up props to render</p>
      <Fetch url="ffs" Success={() => <p>Data</p>} />

      <RenderUsers
        data={users}
        ErrorMsg={
          <div className="text-center my-3 p-4">
            <CircularProgress />
          </div>
        }
        id="renderdiv"
        className="my-auto mx-auto p-4"
      />
      <Divider />
    </div>
  );
}
const RenderUsers = ({
  data = [],
  ErrorMsg,
  RenderUser = (data, index) => (
    <ListItemText
      primary={` ${index + 1}. ${data.clientName} `}
      secondary={data.clientPhone}
    />
  ),
  ...props
}) => {
  const [clicked, setClicked] = React.useState<number>(-1);
  if (!data.length) return ErrorMsg;

  return (
    <div style={{ maxWidth: 500, background: "#ccc" }} {...props}>
      <ReusableList
        data={data}
        clicked={clicked}
        RenderUser={RenderUser}
        setClicked={setClicked}
      />
    </div>
  );
};
export default RenderProps;
type Tri = string;
interface Userve<T = Tri> {
  firstName: T;
  secondName: T;
}
class SupplyUser implements Userve<string> {
  private _firstName: string;
  private _secondName: string;
  constructor(fname: string, sname: string) {
    this._firstName = fname;
    this._secondName = sname;
  }
  get firstName(): string {
    return this._firstName;
  }
  set firstName(name: string) {
    this._firstName = name;
  }
  get secondName() {
    return this._secondName;
  }
}

function showServe(user: SupplyUser) {
  user.firstName = "Jules";
  console.log(user instanceof SupplyUser, "serve");
}

showServe(new SupplyUser("Vince", "Kipyegon"));

function ReusableList({
  data,
  RenderUser,
  clicked = -1,
  setClicked = (f) => f,
}) {
  return (
    <List>
      {data.map((item, i) => (
        <ListItem
          divider
          dense
          className={clicked === i ? "bg-red-500 text-white" : ""}
          key={i}
          onClick={() => setClicked(i)}
        >
          <ListItemIcon>
            {" "}
            {clicked === i ? <CheckCircleOutlineIcon color="primary" /> : null}
          </ListItemIcon>

          {RenderUser(item, i)}
        </ListItem>
      ))}
    </List>
  );
}
function ReactWindow() {
  const bigMap = [...Array(1000)].map((item, index) => ({
    name: index % 2 === 0 ? "Jules" : "Vince",
    id: index + 1,
  }));
  const [isGlobal, setGlobal] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setGlobal(true), 3000);
  }, []);
  console.log(bigMap);
  const Lista = (data, index) => `${index + 1}. ${data.name}`;
  return <ReusableList data={bigMap} RenderUser={Lista} clicked={1} />;
}
