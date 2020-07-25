import React from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  Grid,
  List,
  ListItemText,
  ListItem,
  TextField,
  FormControl,
  FormHelperText,
  Button,
  Box,
  Divider,
  Typography,
  Input,
  IconButton,
} from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import { v4 } from "uuid";
import $ from "jquery";
import * as postactions from "../../redux/posts/actions";

// mock auth
const { uuid, userdept, username } = {
  uuid: 20,
  userdept: 5,
  username: "Vince",
};

export default function Comments({ comments, sendValue, post_id, handler_id }) {
  const [text, setText] = React.useState("");
  const dispatch = useDispatch();

  const btn = React.useRef(null);
  const form = React.useRef(null);
  const getEdited = (data) => {
    dispatch(postactions.addEdited(data));
    $.ajax({
      type: "POST",
      url: "./server/posts/posts.php?editComment=true",
      data,
      dataType: "json",
    })
      .then((res) => console.log(res))
      .catch((error) => console.error(error));
  };
  const handleDelete = (id) => {
    if (confirm("Delete comment?")) {
      dispatch(postactions.deleteComment(id));
      axios.get(
        `./server/posts/posts.php?deleteComment=true&id=${id}&uuid=${uuid}`
      );
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (text.trim().length > 0) {
      btn.current.disabled = true;

      const comment = {
        comment: text.trim(),
        altId: v4(),
        uuid,
        post_id,
        addedon: new Date().toLocaleTimeString(),
        addedIn: new Date().toLocaleDateString(),
        addedUn: new Date().toDateString(),
        addedEn: new Date().toLocaleString(),
        addedBy: username,
      };
      // send to redux store
      sendValue(comment);
      // send to server

      $.ajax({
        url: "./server/posts/posts.php?addcomment=true",
        data: comment,
        type: "POST",
        dataType: "json",
      })
        .then((res) => {
          if (res.status === 200) {
            setText("");
            form.current.reset();
            btn.current.disabled = false;
          } else {
            throw new Error(res.msg);
          }
        })
        .catch((error) => {
          btn.current.disabled = false;
          console.error("add err", error);
        });
      //remove on prod
      setText("");
      form.current.reset();
    }
  };
  return (
    <Grid
      container
      spacing={2}
      alignItems="flex-start"
      justify="flex-start"
      alignContent="flex-start"
    >
      <Grid md={6} xs={12} item>
        <form
          onSubmit={handleSubmit}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
          ref={form}
        >
          <TextField
            label="Write comment"
            variant="outlined"
            multiline
            rows={3}
            cols={40}
            onChange={(e) => setText(e.target.value)}
          />
          <Box className="my-2">
            <Button color="primary" type="submit" variant="contained" ref={btn}>
              Comment
            </Button>
          </Box>
        </form>
      </Grid>
      <Grid md={6} xs={12} item>
        {comments.length ? (
          <CommentsCounter comments={comments.length} />
        ) : null}
        <CommentsList
          list={comments}
          handler_id={handler_id}
          getEdited={getEdited}
          deleteKey={handleDelete}
        />
      </Grid>
    </Grid>
  );
}

const CommentsList = ({ list, getEdited, deleteKey, handler_id }) => {
  const [editing, setEditing] = React.useState({
    clicked: false,
    id: undefined,
  });
  const handleCommentEdit = (e) => {
    if (e.target) {
      setEditing({
        clicked: true,
        id: e.target.dataset.editor,
      });
    }
  };

  return (
    <Box>
      {list.map((item, index) => (
        <Box key={item.altId}>
          <span style={{ fontSize: 16 }} className="text-primary">
            {item.addedBy}
          </span>
          <p style={{ fontSize: 14, fontWeight: "normal" }}>{item.comment}</p>
          <FormHelperText> {item.addedEn}</FormHelperText>
          <EditInput
            id={item.altId}
            comment={item.comment}
            display={editing.clicked && editing.id === item.altId}
            sendEdited={getEdited}
            autoFocus
            setEditing={setEditing}
          />
          {/* Restriction */}
          {handler_id === uuid ? (
            <>
              <FormHelperText>
                <IconButton onClick={() => deleteKey(item.altId)}>
                  <Delete size="sm" color="secondary" className="ml-3" />
                </IconButton>{" "}
                |
                <IconButton
                  data-editor={item.altId}
                  onClick={handleCommentEdit}
                >
                  <Edit color="primary" data-editor={item.altId} />
                </IconButton>
              </FormHelperText>
            </>
          ) : null}

          <Divider />
        </Box>
      ))}
    </Box>
  );
};
const CommentsCounter = ({ comments }) => (
  <Typography variant="subtitle1">
    {comments} {comments > 1 ? "comments" : "comment"}
  </Typography>
);

const EditInput = ({ id, display, comment, sendEdited, setEditing }) => {
  const [edit, setEdit] = React.useState(comment);
  const handleChange = (e) => {
    setEdit(e.target.value);
  };
  React.useEffect(() => {
    setEdit(comment);
  }, [comment]);

  const handleEdited = (e) => {
    if (e.key === "Enter") {
      if (edit.trim().length !== comment.trim().length) {
        sendEdited({ id, edit, addedEn: new Date().toLocaleString() });
        setEditing({
          clicked: false,
          id: undefined,
        });
        setEdit("");
      } else {
        setEditing({
          clicked: false,
          id: undefined,
        });
      }
    } else if (e.key === "Escape") {
      setEditing({
        clicked: false,
        id: undefined,
      });
    }
  };

  return (
    <FormControl style={{ display: display ? "inline" : "none" }}>
      <TextField
        type="text"
        value={edit}
        onChange={handleChange}
        onKeyDown={handleEdited}
      />
      <FormHelperText error>
        press enter to comment or esc to cancel
      </FormHelperText>
    </FormControl>
  );
};
