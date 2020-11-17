import React from "react";
import { List, ListItem, ListItemText, Badge } from "@material-ui/core";
import { Notifications } from "@material-ui/icons";

const RelatedIssues = ({ relatedissues = [], sendRelated = (f) => f }) => {
  return (
    <List align="left">
      {relatedissues.map((item, i) => (
        <ListItem
          key={item.id}
          buttons
          divider
          selected
          className={item.selected ? "bg-red-500 text-white" : "bg-white"}
          align="right"
          onClick={() => sendRelated(item.issue, item.issueId)}
        >
          <ListItemText primary={item.issue} />
          <Badge color="secondary" badgeCount={item.issuecount}>
            <Notifications color="secondary" />
          </Badge>
        </ListItem>
      ))}
    </List>
  );
};
export default RelatedIssues;
