import { makeStyles } from '@material-ui/core/styles';
import {
  AddBox,
  ArrowUpward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
} from '@material-ui/icons';
import MaterialTable, { Icons } from 'material-table';
import React, { forwardRef } from 'react';
import { useHistory } from 'react-router';
import {
  StudentsDocument,
  useAddStudentMutation,
  useEditStudentMutation,
  useStudentsQuery,
} from 'types/graphql';
import Dashboard from './Dashboard';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    // padding: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  form: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  table: {
    // minWidth: 650
  },
  button: {
    margin: theme.spacing(1),
  },
}));

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
  )),
};

const Students: React.FC = () => {
  const classes = useStyles();
  const { data } = useStudentsQuery();
  const [addStudent] = useAddStudentMutation({
    refetchQueries: [{ query: StudentsDocument }],
  });
  const [editStudent] = useEditStudentMutation({
    refetchQueries: [{ query: StudentsDocument }],
  });

  const students = data?.students || [];
  const history = useHistory();
  return (
    <Dashboard title="Manage Students">
      <div className={classes.root}>
        <MaterialTable
          options={{
            filtering: true,
            pageSizeOptions: [10, 20, 30],
          }}
          icons={tableIcons}
          editable={{
            onRowAdd: async (rowData) => {
              await addStudent({ variables: rowData });
            },
            onRowUpdate: async (newData, oldData) => {
              await editStudent({ variables: newData });
            },
            onRowDelete: async (rowData) => {},
          }}
          onRowClick={(event, rowData) => {
            if (rowData) history.push(`/admin/student/${rowData.id}`);
          }}
          columns={[
            { title: 'Name', field: 'name' },
            { title: 'Phone', field: 'phone' },
            { title: 'Emergency contact', field: 'emergencyName' },
            { title: 'Emergency Phone', field: 'emergencyPhone' },
            { title: 'Relation', field: 'emergencyRelation' },
            { title: 'Address', field: 'detailedAddress' },
          ]}
          data={students}
          title="Students"
        />
      </div>
    </Dashboard>
  );
};
export default Students;
