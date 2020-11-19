import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { v4 } from "uuid";
import {
  Grid,
  FormHelperText,
  Card,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Box from "@material-ui/core/Box";
import AddCircle from "@material-ui/icons/AddCircle";

import Layout, { useAuth } from "../components/Layout";

import { ShowDepts, ShowUsers } from "../components/posts/post";
import * as useractions from "../redux/usersReducer/actions";
import * as userdepts from "../redux/departments/actions";
import * as issueactions from "../redux/Issues/actions";
import FetchDepts from "../lib/api/depts";
import CustomerForm from "../components/customerIssues/customerform";
import { getLocal, handleLocalStorage } from "../components/helpers";

const useStyles = makeStyles({
  grid: { minWidth: 300 },
  root: {
    width: "90%",
    margin: ".5rem auto",
    border: "1px solid red",
    padding: "1rem",
  },
  textarea: {
    width: "80",
    margin: "1rem auto",
    borderRadius: 10,
  },
  formControl: {
    width: "100%",
  },
  input: {
    padding: "0.15rem",
    width: "100%",
    margin: "0.25rem 0.15rem",
  },
});
// This cool custom hook courtesy of Eve Porcello
const useInput = (initialValue) => {
  const [value, setValue] = React.useState(initialValue);
  return [
    { value, onChange: (e) => setValue(e.target.value) },
    () => setValue(initialValue),
  ];
};

// context
const CustomerContext = React.createContext();
export const useCustomerContext = () => React.useContext(CustomerContext);

function AddPost() {
  const [clientName, setClientName] = useInput("");
  const [clientPhone, setClientPhone] = React.useState("");
  const [clientEmail, setClientEmail] = React.useState("");
  const [clientOrg, setClientOrg] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [issue, setIssue] = React.useState([]); // issues clicked
  const [handler, setHandler] = React.useState([]); // tracks handlers
  const [subject, setSubject] = React.useState("");
  const [clientDept, setClientDept] = React.useState([]); // tracks departments
  const [errormsg, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [userId, setUserId] = React.useState({});

  const { uuid, userdept } = userId;
  const form = React.useRef(null);
  const btn = React.useRef(null);

  // hit redux store,like a boss

  const { issues, selectedUsers: users, departments, depterr } = useSelector(
    (state) => ({
      issues: state.issues.fetched,
      selectedUsers: state.users.selectedUsers,
      departments: state.departments.departments,
      depterr: state.departments.errorMsg,
    })
  );
  const dispatch = useDispatch();
  // set classes and date
  const classes = useStyles();
  const today = new Date();
  // Run side effects
  React.useEffect(() => {
    setUserId(useAuth());

    console.log("Effect", clientDept);

    if (!departments.length || !issues.length) {
      FetchDepts("/departments/fetchdepts/true", dispatch);
    }

    return () => {
      dispatch(userdepts.resetSelected());
      dispatch(useractions.resetSelected());
      dispatch(issueactions.resetIssues());
    };
  }, []);

  // fetch users from clicked department
  const fetchSelectedUsers = (id) => {
    axios
      .get(`/posts/deptusersposts/${id}/${uuid}`)
      .then((res) => {
        if (!res.data.length || !Array.isArray(res.data)) {
          // add object property selected of false
          throw new Error("There is no user from the selected department");
        }
        return res.data.map((user) => ({
          ...user,
          selected: false,
        }));
      })
      // send to redux
      .then((data) => dispatch(useractions.addselectedUsers(data)))
      .catch((error) => setError(error.message))
      .finally(() => setTimeout(setError(""), 3000));
  };
  // fetch selected issues according to dept

  const fetchSelectedIssues = (id) => {
    axios
      .get(`/issues/fetchSelectedIssue/${id}`)
      .then((res) => {
        if (!res.data.length || !Array.isArray(res.data)) {
          throw new Error(
            "There are no issues related to the selected department"
          );
        }
        const fetchedIssues = res.data.map((item) => ({
          ...item,
          selected: false,
        }));
        dispatch(issueactions.addFetched(fetchedIssues));
      })
      .catch((error) => setError(error.message))
      .finally(() => setTimeout(setError(""), 3000));
  };
  /* This function tracks the users selected or unselected as well as when 2 users from same department are clicked */
  const handleUser = (user) => {
    // check if users already clicked

    const index = handler.findIndex((item) => item.id === user.id);
    // if so,remove from list and tell redux
    if (index >= 0) {
      handler.splice(index, 1);
      // send to redux store
      dispatch(useractions.editSelected(user.id));
    } else {
      // check if user from same department already added
      const userdeptexists = handler.some(
        (handle) => handle.userdept === user.userdept
      );

      if (userdeptexists) {
        alert("Cannot add 2 users from the same department");
      } else {
        // add to state and redux for ud
        setHandler([...handler, user]);
        // send to redux store
        dispatch(useractions.editSelected(user.id));
      }
    }
  };

  /* This function (event handler) checks whether a department has been clicked; removes or adds */
  const handleDept = (data) => {
    // find if incoming dept is already in array or not
    const deptIndex = clientDept.findIndex((dept) => dept.id === data.id);
    if (deptIndex >= 0) {
      // removes if it exists
      clientDept.splice(deptIndex, 1);
    } else {
      // adds to tracking array, client dept
      setClientDept([...clientDept, data]);
    }
    // send to redux store,notify redux to select or unselect
    const { selected } = data;
    dispatch(userdepts.editSelected(data.id));

    // fetch users from selected department or delete department and selected users
    if (selected) {
      dispatch(useractions.removeSelectedUsers(data.id));
      dispatch(issueactions.removeFetched(data.id));
      // remove users already handler array on component
      setHandler(handler.filter((handle) => handle.userdept !== data.id));
    } else {
      fetchSelectedUsers(data.id);
      fetchSelectedIssues(data.id);
    }
  };

  /* This  function (event handler)  tracks the issues being clicked; removed or added */
  const handleIssue = (incomingIssue) => {
    // incoming issue is the array from select element
    // check if an issue is being added or removed
    if (incomingIssue.length > issue.length) {
      // select added issue
      const theItem = incomingIssue[incomingIssue.length - 1];
      // confirm if the issue  exists already on state
      const theIssue = issues.find((item) => item.id === theItem);

      if (theIssue) {
        // if it exists,check if there is similar issue selected as one can only select one issue per dept per user
        const exists = issues.some(
          (item) => item.userdept === theIssue.userdept && item.selected
        );
        if (!exists) {
          dispatch(issueactions.addSelected(theItem));
          // set state
          setIssue(incomingIssue);
        } else {
          // tell the user to select one issue per department
          /* eslint-disable no-alert */
          alert(
            "Cannot select 2 issues from same department, split the post into 2"
          );
        }
      }
    } else {
      // here its a bit tricky.. check which item was removed by comparing array state and  incoming issue from select element
      issue.forEach((item) => {
        // check if item doesn't exist on issue array
        if (incomingIssue.indexOf(item) < 0) {
          // remove item from redux
          dispatch(issueactions.removeSelected(item.id));
        }
      });
      // set the damn state
      setIssue(incomingIssue);
    }
  };
  /* This utility function tracks issues associated with departments, magic, should even gp outside the component */
  const appendHandlerToIssue = (handler, issues) => {
    let holder = [],
      missingParts = [];

    handler.forEach((item) => {
      const res = issues.find((d) => d.userdept === item.userdept);
      if (res) {
        const token = `${item.id}-${res.id}`;

        holder = [...holder, { ...item, id: token }];
      } else {
        missingParts = [...missingParts, item];
      }
    });
    return [holder, missingParts];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (clientName.value.trim().length < 6) {
      setError("Kindly add a client or company name");
    } else if (issue.length < 1) {
      console.log("issues issues", appendHandlerToIssue(handler, issues)[1]);

      setError("Kindly select the nature of issue");
    } else if (subject.trim().length < 6) {
      setError("Kindly add the subject of the issue");
    } else if (message.trim().length < 10) {
      setError("Kindly provide a brief description of the issue");
    } else if (clientDept.length < 1) {
      setError("Please click on  the department to handle issue");
    } else if (handler.length < 1) {
      setError("Please click on the officer(s) to handle issue");
    } else if (
      clientName.value.trim().length > 5 &&
      issue.length > 0 &&
      subject.trim().length > 5 &&
      message.trim().length > 9 &&
      clientDept.length > 0 &&
      handler.length > 0
    ) {
      // send to server
      setError("");
      btn.current.disabled = true;

      const handlers = appendHandlerToIssue(handler, issues)[0];
      const depts = appendHandlerToIssue(clientDept, issues)[0];

      const data = {
        clientName: clientName.value,
        clientPhone,
        clientEmail,
        clientOrg,
        message,
        handler: handlers.map((user) => user.id).join("*"),
        subject,
        clientDept: depts.map((user) => user.id).join("*"),
        addedBy: uuid,
        status: 0,
        altId: v4(),
        addedon: new Date().toLocaleString(),
      };
      console.log("dara", depts, handlers, issue, data, clientDept);
      // Remove on prod
      // handleLocalStorage(data, "posts");

      axios
        .post("/posts/addposts", { ...data })
        .then((res) => {
          console.log("res", res);
          if (res.data.status === 200) {
            setSuccess(res.msg);

            // reset everything
            setTimeout(() => {
              dispatch(useractions.resetSelected([]));
              dispatch(userdepts.resetSelected([]));
              dispatch(issueactions.resetIssues([]));
              setSuccess();
              setClientName();
              setClientPhone("");
              setClientEmail("");
              setClientOrg("");
              setMessage("");
              setIssue([]);
              setHandler([]);
              setSubject("");
              setClientDept([]);

              form.current.reset();
            }, 2000);
          } else {
            throw new Error(res.msg);
          }
        })
        .catch((error) => {
          console.log("BBC", error, error.statusText, error.message);
        })
        .finally(() => {
          btn.current.disabled = false;
        });
    } else {
      console.log(
        "Harrsi",
        clientName.value,
        issue,
        subject,
        message,
        clientDept,
        handler
      );
      setError(
        "Kindly ensure name,type of issue,subject,message,department and officer in-charge fields are not empty"
      );
    }
  };
  console.log(clientDept, clientName.value, "monday");
  return (
    <CustomerContext.Provider
      value={{
        classes,
        issues,
        btn,
        success,
        errormsg,
        clientName,
        setClientPhone,
        setClientEmail,
        setClientOrg,
        handleIssue,
        setSubject,
        setMessage,
        issue,
      }}
    >
      <Layout>
        <Box className={classes.root}>
          <form className="form" ref={form} onSubmit={handleSubmit}>
            <Typography
              variant="body1"
              className="text-center alert alert-info p-2 mt-2 sm:text-left"
            >
              Add Customer details - {today.toDateString()}
            </Typography>

            <Grid container justify="space-evenly" alignItems="flex-start">
              <Grid item xs={12} lg={4} md={4} className={classes.grid}>
                {/* eslint-disable no-nested-ternary */}
                {departments.length ? (
                  <div>
                    <ShowDepts depts={departments} getDept={handleDept} />

                    <Card>
                      <small>Selected departments</small>
                      <SelectedDepts depts={departments} />
                    </Card>
                  </div>
                ) : !depterr ? (
                  <div className="mx-auto my-4 p-4 text-center">
                    <CircularProgress color="primary" size="3rem" />
                    <Typography>Loading departments</Typography>
                  </div>
                ) : (
                  <div className="mx-auto my-4 p-4 text-center">
                    <Alert severity="warning">
                      <p>{depterr}</p>
                    </Alert>
                  </div>
                )}
              </Grid>
              {/** This grid display a list of users after a department is clicked */}
              <Grid item xs={12} lg={4} md={4} className={classes.grid}>
                {users.length > 0 ? (
                  <ShowUsers users={users} getUser={handleUser} />
                ) : departments.length ? (
                  <div className="mx-auto my-4 p-4 text-center">
                    <Alert severity="info">
                      <Typography>
                        {" "}
                        Click on department to load users
                      </Typography>
                    </Alert>
                  </div>
                ) : null}
              </Grid>
              <Grid
                item
                xs={12}
                lg={4}
                md={4}
                className={`my-3 p-2 card w-100 ${classes.grid}`}
                style={{ border: "1px solid yellow" }}
              >
                <CustomerForm />
              </Grid>
            </Grid>
          </form>
        </Box>
      </Layout>
    </CustomerContext.Provider>
  );
}
export default AddPost;

const SelectedDepts = ({ depts }) =>
  depts
    .filter((dept) => dept.selected)
    .map((dept, i) => (
      <FormHelperText key={dept.id}>
        {i + 1}.{dept.altName}
      </FormHelperText>
    ));
