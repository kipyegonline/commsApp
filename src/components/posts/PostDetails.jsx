import React from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  ButtonGroup,
} from "@material-ui/core";

const PostDetails = ({
  issue,
  clientOrg,
  clientPhone,
  clientEmail,
  clientName,
  subject,
  message,
  addedBy,
  handler_id,
  adder,
  status,
  addedon,
  handleResolve,
  uuid,
}) => {
  return (
    <Box className="my-2 p-2">
      <Typography variant="h6"> {subject}</Typography>
      <Divider />
      <Box>
        <Typography> {message}</Typography>
      </Box>

      <Divider />
      <Box>
        <Typography variant="body2">Name: {clientName}</Typography>
        <Typography variant="body2">
          Contacts: {clientPhone}, ({clientEmail})
        </Typography>
        <Typography variant="body2">Company/location: {clientOrg}</Typography>
      </Box>
      <Box>
        <small>
          {" "}
          Added by {<b>{+adder === uuid ? "You" : addedBy} </b>} on {addedon}
        </small>
        <Typography>Status: {+status}</Typography>
      </Box>
      <Box>
        {/* Restriction */}
        {Number(handler_id) === uuid ? (
          <ButtonGroup className="my-2">
            <Button
              variant={+status === 1 ? "contained" : "outlined"}
              size="small"
              color="primary"
              className="mr-2 my-2"
              onClick={() => handleResolve(status, 1)}
            >
              {+status === 1 ? "In Progress" : "Put in progress"}
            </Button>
            <Button
              variant="contained"
              size="small"
              color="primary"
              className="bg-success ml-1 my-2"
              onClick={() => handleResolve(status, 2)}
            >
              {+status === 2 ? "Resolved" : "Resolve"}
            </Button>
          </ButtonGroup>
        ) : null}
      </Box>
    </Box>
  );
};

export default PostDetails;
