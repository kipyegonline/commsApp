import React from "react";
import Router from "next/router";
import PropTypes from "prop-types";
import Link from "next/link";
import Search from "@material-ui/icons/Search";
import Done from "@material-ui/icons/DoneAll";
import {
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  ButtonGroup,
  ListItemText,
  FormHelperText,
  Input,
  TextField,
  InputLabel,
  FormControl,
  Card,
  CardActions,
  Typography,
} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import Pagination from "@material-ui/lab/Pagination";
import DisplayIssues, { DisplayUsers, RangeInput } from "./post";
import { display } from "@material-ui/system";

function PostsTable({ posts = [], setTicks = (f) => f, userId = 0 }) {
  const perpage = posts.length >= 10 ? 10 : posts.length;
  const pages = Math.ceil(posts.length / perpage);
  const [current, setCurrent] = React.useState(0);

  const start = current * perpage;
  const end = current * perpage + perpage;
  const handleChange = (e, p) => setCurrent(p - 1);
  console.log("PostTable Render", userId);
  return (
    <>
      <Counter posts={posts.length} />
      <TableContainer className="table-responsive">
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell component="th" scope="row" className="thead">
                #
              </TableCell>
              <TableCell scope="row" className="thead bg-light">
                Name
              </TableCell>
              <TableCell scope="row" className="thead bg-light">
                Contacts
              </TableCell>
              <TableCell scope="row" className="thead bg-light">
                Organisation
              </TableCell>
              <TableCell scope="row" className="thead bg-light">
                Issue
              </TableCell>

              <TableCell scope="row" className="thead bg-light">
                Handler
              </TableCell>

              <TableCell scope="row" className="thead bg-light">
                Status
              </TableCell>
              <TableCell scope="row" className="thead bg-light">
                Added on
              </TableCell>
              <TableCell scope="row" className="thead bg-light">
                Added By
              </TableCell>
              <TableCell scope="row" className="thead bg-light">
                Details
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.slice(start, end).map((post, i) => (
              <PureTableInfo
                key={post.id}
                {...post}
                setTicks={setTicks}
                index={i}
                userId={userId}
              />
            ))}
          </TableBody>
        </Table>
        <style jsx>
          {`
            .thead {
              font-weight: bold;
              color: red;
            }
          `}
        </style>
      </TableContainer>

      <Pagination
        color="primary"
        rounded
        count={pages}
        defaultPage={current + 1}
        size="large"
        onChange={handleChange}
      />
    </>
  );
}

const TableBodyInfo = ({
  id,
  index = "",
  clientName = "",
  clientPhone = "",
  clientEmail = "",
  clientOrg = "",
  message = "",
  handler = "",
  issue = "",
  handler_id = 0,
  subject = "",
  clientDept = "",
  addedBy = "",
  status = "",
  adder = "",
  altId = "",
  addedon = "",
  seen = "0",
  setTicks = (f) => f,
  userId = 0,
}) => {
  const [uuid, setUuid] = React.useState(userId);
  React.useEffect(() => {
    setUuid(userId);
    console.log("Post Table Body  Effect", uuid);
  }, [uuid]);
  //checking status

  const checkStatus = (status) => {
    if (Boolean(Number(status))) {
      if (Number(status) > 1) {
        return ["bg-success", "Resolved"];
      }
      return ["bg-info", "In-progress"];
    }
    return ["bg-warning", "Pending"];
  };

  // routing to next page and registering blue tucks
  const handlePostClick = (id, altId, subject, issue) => {
    // set blue ticks
    if (uuid === +handler_id && seen === 0) {
      setTicks(id);
    }

    // Route to another page
    Router.push(`/post/${altId}`, undefined, {
      shallow: false,
    });
  };
  console.log("Post table body  Render", uuid);
  return (
    <TableRow>
      <TableCell>
        {index + 1}
        <Done htmlColor={Boolean(Number(seen)) ? "lightblue" : ""} />{" "}
      </TableCell>
      <TableCell onClick={() => handlePostClick(id, altId, subject, issue)}>
        <Link href={`/post/${altId}`}>
          <a>{clientName}</a>
        </Link>
      </TableCell>
      <TableCell>
        {clientPhone} <br />
        <small>{clientEmail}</small>
      </TableCell>
      <TableCell>{clientOrg}</TableCell>
      <TableCell>{issue}</TableCell>

      <TableCell>
        <b>{+handler_id === uuid ? "You" : handler} </b>
      </TableCell>
      <TableCell>
        <Button className={`${checkStatus(status)[0]} text-white`} size="small">
          {checkStatus(status)[1]}
        </Button>
      </TableCell>
      <TableCell>{addedon}</TableCell>
      <TableCell>
        <b>{adder === uuid ? "You" : addedBy} </b>
      </TableCell>
      <TableCell>
        <Button
          variant="contained"
          color="secondary"
          target="_blank"
          onClick={() => handlePostClick(id, altId, subject, issue)}
        >
          Details
        </Button>
      </TableCell>
    </TableRow>
  );
};
const PureTableInfo = React.memo(
  TableBodyInfo,
  (prevProps, nextProps) => prevProps.id === nextProps.id
);
export default PostsTable;

/* The darn toolbar */
export const ToolBar = ({
  sendGroup = (f) => f,
  issues = [],
  setIssue = (f) => f,
  issue = string,
  users = [],
  user = {},
  getUser = (f) => f,
  handleSearch = (f) => f,
  getDate = (f) => f,
}) => {
  return (
    <Grid
      container
      justify="space-evenly"
      alignItems="center"
      wrap="wrap"
      className="my-2 p-2"
    >
      <Grid item grow={3}>
        <Card>
          Search
          <SearchTextField sendValue={handleSearch} />
        </Card>
      </Grid>
      <Grid item>
        <Card>
          <p>View by resolution stages</p>
          <CardActions>
            <ButtonGroup
              variant="contained"
              color="primary"
              aria-label="contained primary button group"
            >
              <Button onClick={() => sendGroup(0)} className="bg-warning">
                Pending
              </Button>

              <Button className="bg-info mx-2" onClick={() => sendGroup(1)}>
                In-progress{" "}
              </Button>
              <Button className="bg-success" onClick={() => sendGroup(2)}>
                Resolved
              </Button>
            </ButtonGroup>
          </CardActions>
        </Card>
      </Grid>

      <Grid item>
        <p>View by issues</p>
        <DisplayIssues issues={issues} getIssue={setIssue} issue={issue} />
      </Grid>
      <Grid item>
        <p> View By days</p>
        <TextField type="date" onChange={(e) => getDate(e.target.value)} />
      </Grid>
      <Grid item>
        <p> view by Colleagues </p>
        <DisplayUsers users={users} getUser={getUser} user={user} />
      </Grid>
    </Grid>
  );
};
/*
 
         <Link as={"post"} onClick={()=>handlePostClick(id,altId)} href={`/post?issue=${altId}`}>
          <a target="_blank"> Details</a>
        </Link> */

const SearchTextField = ({ sendValue = (f) => f }) => {
  const [search, setSearch] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (search.trim().length > 0) {
      sendValue(search);
    }
  };
  return (
    <form
      className={"form w-100"}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <FormControl>
        <InputLabel htmlFor="search-post">Search name,email,phone</InputLabel>
        <Input
          error
          type="search"
          id="search-post"
          label="Outlined"
          variant="outlined"
          autoFocus
          onChange={(e) => setSearch(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <Search
                size="large"
                style={{ cursor: "pointer" }}
                onClick={handleSubmit}
              />
            </InputAdornment>
          }
          aria-describedby="standard-weight-helper-text"
          inputProps={{
            "aria-label": "search",
          }}
        />
        <FormHelperText>Search anything</FormHelperText>
      </FormControl>
    </form>
  );
};
const Counter = ({ posts }) => (
  <Typography>
    {posts} {posts > 1 ? "issues" : post < 1 ? "" : "issue"}
  </Typography>
);
Counter.propTypes = { posts: PropTypes.number.isRequired };

/*Spanning

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const TAX_RATE = 0.07;

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, qty, unit) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [
  createRow('Paperclips (Box)', 100, 1.15),
  createRow('Paper (Case)', 10, 45.99),
  createRow('Waste Basket', 2, 17.99),
];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;

export default function SpanningTable() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={3}>
              Details
            </TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Desc</TableCell>
            <TableCell align="right">Qty.</TableCell>
            <TableCell align="right">Unit</TableCell>
            <TableCell align="right">Sum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.desc}>
              <TableCell>{row.desc}</TableCell>
              <TableCell align="right">{row.qty}</TableCell>
              <TableCell align="right">{row.unit}</TableCell>
              <TableCell align="right">{ccyFormat(row.price)}</TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tax</TableCell>
            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
*/

/*text field
const SearchTextField = () => {
  return (
    <form className={"form"} noValidate autoComplete="off">
      <TextField id="standard-basic" label="Standard" />
      <TextField id="filled-basic" label="Filled" variant="filled" />
      <TextField
        type="search"
        id="outlined-basic"
        helperText="Search"
        label="Outlined"
        variant="outlined"
      />
    </form>
  );
};

*/
/**
 * virtualized
 * import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';

const styles = (theme) => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
    },
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
});

class MuiVirtualizedTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };

  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  render() {
    const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: 'inherit',
            }}
            headerHeight={headerHeight}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired,
    }),
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number,
};

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

// ---

const sample = [
  ['Frozen yoghurt', 159, 6.0, 24, 4.0],
  ['Ice cream sandwich', 237, 9.0, 37, 4.3],
  ['Eclair', 262, 16.0, 24, 6.0],
  ['Cupcake', 305, 3.7, 67, 4.3],
  ['Gingerbread', 356, 16.0, 49, 3.9],
];

function createData(id, dessert, calories, fat, carbs, protein) {
  return { id, dessert, calories, fat, carbs, protein };
}

const rows = [];

for (let i = 0; i < 200; i += 1) {
  const randomSelection = sample[Math.floor(Math.random() * sample.length)];
  rows.push(createData(i, ...randomSelection));
}

export default function ReactVirtualizedTable() {
  return (
    <Paper style={{ height: 400, width: '100%' }}>
      <VirtualizedTable
        rowCount={rows.length}
        rowGetter={({ index }) => rows[index]}
        columns={[
          {
            width: 200,
            label: 'Dessert',
            dataKey: 'dessert',
          },
          {
            width: 120,
            label: 'Calories\u00A0(g)',
            dataKey: 'calories',
            numeric: true,
          },
          {
            width: 120,
            label: 'Fat\u00A0(g)',
            dataKey: 'fat',
            numeric: true,
          },
          {
            width: 120,
            label: 'Carbs\u00A0(g)',
            dataKey: 'carbs',
            numeric: true,
          },
          {
            width: 120,
            label: 'Protein\u00A0(g)',
            dataKey: 'protein',
            numeric: true,
          },
        ]}
      />
    </Paper>
  );
}
 */

/*Alert
 import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';



 */
