import React from "react";
import Router from "next/router";
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
  Chip,
  Avatar,
  Card,
  CardActions,
  Typography,
} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import Pagination from "@material-ui/lab/Pagination";
import DisplayIssues, { DisplayUsers, RangeInput } from "./post";
import { display } from "@material-ui/system";

// mock auth
const { uuid, userdept } = { uuid: 20, userdept: 5 };

function PostsTable({ posts = [], setTicks = (f) => f }) {
  const perpage = posts.length >= 10 ? 10 : posts.length;
  const pages = Math.ceil(posts.length / perpage);
  const [current, setCurrent] = React.useState(0);
  const handleChange = (e, page) => {
    setCurrent(page - 1);
  };

  const start = current * perpage;
  const end = current * perpage + perpage;

  return (
    <>
      <Typography>{posts.length} issues</Typography>
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
                Subject
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
              <TableBodyInfo
                key={post.id}
                {...post}
                setTicks={setTicks}
                index={i}
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
  altId = "",
  addedon = "",
  seen = "0",
  setTicks = (f) => f,
}) => {
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
    if (uuid === +handler_id && seen === "0") {
      setTicks(id);
    }
    const subjectAs = subject.split(" ").join("-");
    // Route to another page
    Router.push(`/post?issue=${altId}`, undefined, {
      shallow: false,
    });
  };
  return (
    <TableRow>
      <TableCell>
        {index + 1}
        <Done color={Boolean(Number(seen)) ? "secondary" : "inherit"} />{" "}
      </TableCell>
      <TableCell>{clientName}</TableCell>
      <TableCell>
        {clientPhone} <br />
        <small>{clientEmail}</small>
      </TableCell>
      <TableCell>{clientOrg}</TableCell>
      <TableCell>{issue}</TableCell>
      <TableCell>{subject}</TableCell>
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
        <b>{+handler_id === uuid ? "You" : addedBy} </b>
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
export default PostsTable;

export const ToolBar = ({
  sendGroup,
  issues,
  setIssue,
  issue,
  users,
  user,
  getUser,
  handleSearch,
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
        <p>View by nature of issues</p>
        <DisplayIssues issues={issues} getIssue={setIssue} issue={issue} />
      </Grid>
      <Grid item>
        <p> View By days</p>
        <Chip
          avatar={<Avatar>10</Avatar>}
          color="primary"
          size="medium"
          label="pending"
        />
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
        <InputLabel htmlFor="search-post">Search</InputLabel>
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
        <FormHelperText>Say something</FormHelperText>
      </FormControl>
    </form>
  );
};

/* import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(name, calories, fat) {
  return { name, calories, fat };
}

const rows = [
  createData('Cupcake', 305, 3.7),
  createData('Donut', 452, 25.0),
  createData('Eclair', 262, 16.0),
  createData('Frozen yoghurt', 159, 6.0),
  createData('Gingerbread', 356, 16.0),
  createData('Honeycomb', 408, 3.2),
  createData('Ice cream sandwich', 237, 9.0),
  createData('Jelly Bean', 375, 0.0),
  createData('KitKat', 518, 26.0),
  createData('Lollipop', 392, 0.2),
  createData('Marshmallow', 318, 0),
  createData('Nougat', 360, 19.0),
  createData('Oreo', 437, 18.0),
].sort((a, b) => (a.calories < b.calories ? -1 : 1));

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});

export default function CustomPaginationActionsTable() {
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="custom pagination table">
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.calories}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.fat}
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}*/

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

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function DescriptionAlerts() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        This is an error alert — <strong>check it out!</strong>
      </Alert>
      <Alert severity="warning">
        <AlertTitle>Warning</AlertTitle>
        This is a warning alert — <strong>check it out!</strong>
      </Alert>
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        This is an info alert — <strong>check it out!</strong>
      </Alert>
      <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        This is a success alert — <strong>check it out!</strong>
      </Alert>
    </div>
  );

 */

/*Badge
 import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function SimpleBadge() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Badge badgeContent={4} color="primary">
        <MailIcon />
      </Badge>
      <Badge badgeContent={4} color="secondary">
        <MailIcon />
      </Badge>
      <Badge badgeContent={4} color="error">
        <MailIcon />
      </Badge>
    </div>
  );
}
 */

// <Divider orientation="vertical" flexItem />
/*import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function BasicButtonGroup() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
      <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
      <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    </div>
  );
}

<FAB color="primary" size="large">
<ADDICON/>
</FAB>
*/
