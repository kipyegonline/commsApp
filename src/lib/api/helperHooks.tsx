import React from "react";
import { CircularProgress, Typography } from "@material-ui/core";
import { SmsFailed } from "@material-ui/icons";

type Props = {
  url: string;
  pending: React.FC;
  fulfilled: React.FC;
  failed: React.FC;
};
type returnData = { loading: boolean; errormsg: string; data: any[] };

export function useFetch(url: string): returnData {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [errormsg, setError] = React.useState("");

  React.useEffect(() => {
    if (!url) return;

    fetch(url)
      .then((data) => data.json())
      .then(setData)
      .then(() => setLoading(false))
      .catch((error) => {
        console.log("usefetch");
        setLoading(false);
        setError(error.message);
      });
  }, [url]);

  return { loading, data, errormsg };
}

const SpinnerDiv: React.FC = () => (
  <div className="text-center p-4 m-4">
    <Typography variant="body2">Loading...</Typography>
    <CircularProgress size="3rem" color="secondary" />
  </div>
);
type Err = { errormsg: string };
const ErrorPage = ({ errormsg }: Err) => (
  <div className="text-center p-4 m-4">
    <Typography variant="body2">Something went wrong... {errormsg}</Typography>
  </div>
);
type Fetch = {
  url: string;
  Success: any;
  Failed?: any;
  Spinner?: React.FunctionComponent;
};
function Fetch({
  url,
  Success,
  Spinner = SpinnerDiv,
  Failed = ErrorPage,
}: Fetch) {
  const { loading, errormsg, data } = useFetch(url);
  if (loading) return Spinner;
  if (errormsg) return Failed(errormsg);
  if (data) return Success(data);
}
export default Fetch;
