import { useMutation, useQuery } from "@apollo/client";
import { CircularProgress, TextField } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { SearchOutlined } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import { useState } from "react";
import { deleteUser } from "../../../graphql/mutations/users";
import { getUsers } from "../../../graphql/queries/users";
import { getError } from "../../../utils/error";
import { successMessage } from "../../../utils/message";
import ConfirmDialog from "./ConfirmDialog";

//Sort table data functions start
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
//Sort table data functions end

//Table Headings
const headCells = [
  { id: "image", label: "Image" },
  { id: "name", label: "Name" },
  { id: "dob", label: "Date of Birth" },
  { id: "email", label: "Email" },
  { id: "activated", label: "Activated" },
  { id: "verified", label: "Verified" },
  { id: "last_signed_ip", label: "Last Signed IP" },
  { id: "last_signed_date", label: "Last Signed Date" },
  { id: "action", label: "Action" },
];

//Table Heading Component
function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            padding={"default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              <strong>{headCell.label}</strong>
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

//Material-UI Styling
const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

//Table Main Bar
const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  return (
    <Toolbar className={classes.root}>
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        Users
      </Typography>

      <TextField
        value={props.search}
        onChange={(e) => props.setSearch(e.target.value)}
        id="outlined-basic"
        label="Search"
        variant="outlined"
      />

      <Tooltip title="Search User">
        <IconButton aria-label="filter list">
          <SearchOutlined />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

//Material-UI Styles
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

//Table Main Component
export default function UsersTable() {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  // const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { data, loading, error } = useQuery(getUsers());
  const [rowsTemp, setRowsTemp] = useState(data ? data.getUsers : []);
  const [rows, setRows] = useState([]);
  const [loading1, setLoading1] = useState(false);
  const [loadingTemp, setLoadingTemp] = useState(false);
  const [deleteSingleUser, response] = useMutation(deleteUser);

  //Sorting Handler
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  //Pagination Handler
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  //Rows Changing Handler
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //Table Mode Changing Handler
  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  //handle dialog
  const handleDialog = (id) => {
    setOpen(!open);
    setId(id);
  };

  //Delete User
  const DeleteUser = async () => {
    setLoading1(true);
    setOpen(false);

    try {
      const deleteSingle = await deleteSingleUser({ variables: { id } });

      setRows(deleteSingle.data.deleteUser);
      setRowsTemp(deleteSingle.data.deleteUser);
      successMessage("User Deleted Successfully");
      setLoading1(false);
    } catch (err) {
      getError(err.toString());
      setLoading1(false);
    }
  };

  //search data
  const searchData = (data) => {
    setSearch(data);
    const searchRows = rowsTemp.filter(
      (item) =>
        item.name.toString().toLowerCase().includes(data.toString().toLowerCase()) ||
        item.email.toString().toLowerCase().includes(data.toString().toLowerCase())
    );
    setRows(searchRows);
  };

  if (!loading && !loadingTemp && data) {
    setRows(data.getUsers);
    setRowsTemp(data.getUsers);
    setLoadingTemp(true);
  }

  if (error) {
    return <div style={{ textAlign: "center", marginTop: "20px", fontSize: "22px" }}>{error.message} !</div>;
  }

  if (loading || !data || loading1) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar search={search} setSearch={searchData} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  console.log(row);
                  return (
                    <TableRow hover tabIndex={-1} key={row.id}>
                      <TableCell align="left">
                        <img src={row.profile_image} alt="" style={{ width: "100px" }} />
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.dob}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{row.is_activated ? "Yes" : "No"}</TableCell>
                      <TableCell align="left">{row.is_verfied ? "Yes" : "No"}</TableCell>
                      <TableCell align="left">{row.last_signed_ip}</TableCell>
                      <TableCell align="left">{moment(row.last_signed_date).format("DD/MM/YYYY hh:mm:ss")}</TableCell>
                      <TableCell align="left">
                        <DeleteIcon onClick={() => handleDialog(row.id)} style={{ cursor: "pointer" }} />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          {rows.length === 0 && !loading1 ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>Users Not Found</div>
          ) : null}
          {loading1 ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <CircularProgress />
            </div>
          ) : null}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={rows.length === 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense Padding" />
      <ConfirmDialog open={open} handleClose={handleDialog} deleteUser={DeleteUser} />
    </div>
  );
}
