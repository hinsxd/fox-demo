import { makeStyles } from '@material-ui/core/styles';
import React, { forwardRef } from 'react';
import { useUsersQuery } from 'types/graphql';
import Dashboard from './Dashboard';
import MaterialTable, { Icons } from 'material-table';
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
import { useHistory } from 'react-router';

const useStyles = makeStyles(theme => ({
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

const Users: React.FC = () => {
  const classes = useStyles();
  const { data } = useUsersQuery();
  const users = (data?.users || []).map(
    ({ id, role, email, profile, username }) => ({
      id,
      email,
      role,
      username,
      name: profile?.name || ''
    })
  );
  const history = useHistory();
  return (
    <Dashboard title="Manage Users">
      <div className={classes.root}>
        <MaterialTable
          options={{
            filtering: true,
            pageSizeOptions: [10, 20, 30]
          }}
          icons={tableIcons}
          onRowClick={(event, rowData) => {
            if (rowData) history.push(`/admin/user/${rowData.id}`);
          }}
          columns={[
            { title: 'Username', field: 'username' },
            { title: 'Name', field: 'name' },
            { title: 'Email', field: 'email' },
            {
              title: 'User Type',
              field: 'role',
              type: 'string' as any,
              filtering: true,
              lookup: {
                Admin: 'Admin',
                User: 'Student',
                'New User': 'New User'
              }
            }
          ]}
          data={users}
          title="Users"
        />
      </div>
    </Dashboard>
  );
};
export default Users;
