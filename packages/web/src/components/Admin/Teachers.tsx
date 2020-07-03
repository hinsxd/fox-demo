import {
  Button,
  CircularProgress,
  FormControl,
  TextField,
  InputLabel,
  Input,
  InputAdornment,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState, forwardRef, useEffect } from 'react';
import {
  TeachersDocument,
  useAddTeacherMutation,
  useTeachersQuery,
  useUpdateTeacherMutation,
  TeachersQuery,
  TeacherFragmentFragment
} from 'types/graphql';
import Dashboard from './Dashboard';
import { centsToDollarString } from 'utils/centsToDollarString';
import {
  AddBox,
  Check,
  Clear,
  DeleteOutline,
  ChevronRight,
  Edit,
  SaveAlt,
  FilterList,
  FirstPage,
  LastPage,
  ChevronLeft,
  Search,
  ArrowUpward,
  Remove,
  ViewColumn
} from '@material-ui/icons';
import MaterialTable, { Icons } from 'material-table';
import { SketchPicker, ColorResult } from 'react-color';
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  paper: {
    // padding: theme.spacing(2),
    marginTop: theme.spacing(3)
  },
  form: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  table: {
    // minWidth: 650
  },
  button: {
    margin: theme.spacing(1)
  }
}));

const Teachers: React.FC = () => {
  const classes = useStyles();

  const [teacherDialogState, setTeacherDialogState] = useState({
    teacher: null as TeacherFragmentFragment | null,
    open: false
  });
  const selecteTeacher = (teacher: TeacherFragmentFragment) => {
    setTeacherDialogState({ teacher, open: true });
  };
  const closeTeacherDialog = () => {
    setTeacherDialogState({ teacher: null, open: false });
  };
  const { data } = useTeachersQuery();
  const [addTeacher] = useAddTeacherMutation({
    refetchQueries: [{ query: TeachersDocument }]
  });

  const [name, setName] = useState('');
  const [hourPrice, setHourPrice] = useState(70000);
  const [submitting, setSubmitting] = useState(false);
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);
  const handleHourPriceChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setHourPrice((parseInt(event.target.value, 10) || 0) * 100);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await addTeacher({ variables: { name, hourPrice } });
      // success
      setName('');
      setHourPrice(70000);
    } catch (err) {
      console.log(err);
      // fail
    } finally {
      setSubmitting(false);
    }
  };
  const teachers: TeachersQuery['teachers'] = data?.teachers || [];

  return (
    <Dashboard title="Manage Teachers">
      <div className={classes.root}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <FormControl className={classes.formControl}>
            <TextField
              value={name}
              onChange={handleNameChange}
              name="teacherName"
              label="Name"
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="adornment-amount">Hour Price</InputLabel>
            <Input
              id="adornment-amount"
              type="number"
              value={hourPrice / 100}
              onChange={handleHourPriceChange}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
            />
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {submitting ? <CircularProgress /> : 'Add Teacher'}
          </Button>
        </form>
        <MaterialTable
          options={{
            pageSizeOptions: [10, 20, 30]
          }}
          icons={tableIcons}
          // onRowClick={(event, rowData) => {
          //   // if (rowData) history.push(`/admin/user/${rowData.id}`);
          // }}
          onRowClick={(e, rowData) => {
            if (rowData) selecteTeacher(rowData);
          }}
          columns={[
            { title: 'Name', field: 'name' },
            {
              title: 'Hour Price',
              field: 'hourPrice',
              render: rowData => centsToDollarString(rowData.hourPrice)
            },
            {
              title: 'Color',
              field: 'color',
              render: rowData => (
                <Box
                  bgcolor={rowData.color}
                  width={16}
                  height={16}
                  borderRadius={2}
                ></Box>
              )
            }
          ]}
          data={teachers}
          title="Users"
        />
        <EditTeacherDialog
          {...teacherDialogState}
          onClose={closeTeacherDialog}
        />
        {/* <Paper className={classes.paper} elevation={3}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Delete</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Hour Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.teachers &&
                data.teachers.map(({ id, name, hourPrice }) => {
                  return (
                    <TableRow key={id}>
                      <TableCell component="th" scope="row">
                        <IconButton onClick={handleDeleteTeacher(id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {centsToDollarString(hourPrice)}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Paper> */}
      </div>
    </Dashboard>
  );
};
export default Teachers;

const useTeacherDialogStyles = makeStyles(theme => ({
  input: {
    margin: theme.spacing(1)
  }
}));
const EditTeacherDialog: React.FC<{
  teacher: TeacherFragmentFragment | null;
  open: boolean;
  onClose: () => void;
}> = ({ teacher, open, onClose }) => {
  const classes = useTeacherDialogStyles();
  const [color, setColor] = useState(teacher?.color || '#fff');
  const [hourPrice, setHourPrice] = useState(teacher?.hourPrice || 70000);
  useEffect(() => {
    if (teacher) {
      setColor(teacher.color);
      setHourPrice(teacher.hourPrice);
    }
  }, [teacher]);

  const handleColorChange = (colorResult: ColorResult) => {
    setColor(colorResult.hex);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (teacher)
      await updateTeacher({
        variables: {
          ...teacher,
          color,
          hourPrice
        }
      });
    onClose();
  };
  const [updateTeacher, updateTeacherMeta] = useUpdateTeacherMutation();
  return (
    <Dialog open={open} onClose={onClose}>
      {teacher && (
        <>
          <form onSubmit={handleSubmit}>
            <DialogTitle>Teacher Detail</DialogTitle>
            <DialogContent>
              <Box display="flex" flexDirection="column">
                <TextField
                  label="Name"
                  value={teacher.name}
                  className={classes.input}
                />
                <TextField
                  label="Color"
                  value={color}
                  InputProps={{ style: { color } }}
                  className={classes.input}
                />
                <SketchPicker
                  color={color}
                  onChangeComplete={handleColorChange}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button type="submit" disabled={updateTeacherMeta.loading}>
                Save
              </Button>
            </DialogActions>
          </form>
        </>
      )}
    </Dialog>
  );
};

const tableIcons: Icons = {
  Add: forwardRef<SVGSVGElement>((props, ref) => (
    <AddBox {...props} ref={ref} />
  )),
  Check: forwardRef<SVGSVGElement>((props, ref) => (
    <Check {...props} ref={ref} />
  )),
  Clear: forwardRef<SVGSVGElement>((props, ref) => (
    <Clear {...props} ref={ref} />
  )),
  Delete: forwardRef<SVGSVGElement>((props, ref) => (
    <DeleteOutline {...props} ref={ref} />
  )),
  DetailPanel: forwardRef<SVGSVGElement>((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef<SVGSVGElement>((props, ref) => (
    <Edit {...props} ref={ref} />
  )),
  Export: forwardRef<SVGSVGElement>((props, ref) => (
    <SaveAlt {...props} ref={ref} />
  )),
  Filter: forwardRef<SVGSVGElement>((props, ref) => (
    <FilterList {...props} ref={ref} />
  )),
  FirstPage: forwardRef<SVGSVGElement>((props, ref) => (
    <FirstPage {...props} ref={ref} />
  )),
  LastPage: forwardRef<SVGSVGElement>((props, ref) => (
    <LastPage {...props} ref={ref} />
  )),
  NextPage: forwardRef<SVGSVGElement>((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  PreviousPage: forwardRef<SVGSVGElement>((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef<SVGSVGElement>((props, ref) => (
    <Clear {...props} ref={ref} />
  )),
  Search: forwardRef<SVGSVGElement>((props, ref) => (
    <Search {...props} ref={ref} />
  )),
  SortArrow: forwardRef<SVGSVGElement>((props, ref) => (
    <ArrowUpward {...props} ref={ref} />
  )),
  ThirdStateCheck: forwardRef<SVGSVGElement>((props, ref) => (
    <Remove {...props} ref={ref} />
  )),
  ViewColumn: forwardRef<SVGSVGElement>((props, ref) => (
    <ViewColumn {...props} ref={ref} />
  ))
};
