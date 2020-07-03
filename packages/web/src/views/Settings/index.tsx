import {
  AppBar,
  Button,
  Container,
  Grid,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { KeyboardArrowLeft, Check } from '@material-ui/icons';
import MainContainer from 'components/MainContainer';
import { useAuthContext } from 'context/auth';
import { Form, Formik, useField } from 'formik';
import React from 'react';
import {
  Link,
  Switch,
  Route,
  Redirect,
  RouteComponentProps,
} from 'react-router-dom';
import { MeDocument, useUpdateProfileMutation } from 'types/graphql';
import { yupSchema } from 'utils/yupSchema';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  text: {
    display: 'inline-block',
    verticalAlign: 'text-bottom',
  },
  appBar: {
    backgroundColor: '#fff',
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    // boxShadow: `0px 2px 2px 2px #eeeeee`
  },
}));

const MyTextField: React.FC<TextFieldProps & { name: string }> = (props) => {
  const [field, meta] = useField(props.name);
  return (
    <TextField
      {...field}
      {...props}
      variant="standard"
      fullWidth
      error={meta.touched && !!meta.error}
      helperText={meta.touched && meta.error}
      margin="dense"
    />
  );
};

const Settings: React.FC<RouteComponentProps> = ({ location }) => {
  const classes = useStyles();
  return (
    <>
      <AppBar
        elevation={1}
        position="sticky"
        color="default"
        className={classes.appBar}
      >
        <Container maxWidth="lg">
          <Toolbar variant="dense">
            <Typography variant="h6" noWrap>
              <Link className={classes.link} to="/">
                <KeyboardArrowLeft />
                <span className={classes.text}>Back to Home</span>
              </Link>
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

      <MainContainer>
        <Grid container>
          {/* <Grid item xs={3}>
            <Tabs orientation="vertical" value={tabValue}>
              <Tab
                value="profile"
                label="Profile"
                onClick={() => history.push('/settings/profile')}
              />
              <Tab
                value="account"
                label="Account"
                onClick={() => history.push('/settings/account')}
              />
            </Tabs>
          </Grid> */}
          <Grid item xs={12}>
            <Switch>
              <Route path="/settings/profile">
                <Profile />
              </Route>
              <Route path="/settings/account">
                <Profile />
              </Route>
              <Redirect to="/settings/profile" />
            </Switch>
          </Grid>
        </Grid>
      </MainContainer>
    </>
  );
};

export default Settings;

const Profile: React.FC = () => {
  const { me } = useAuthContext();
  const profile = me?.profile;

  // const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  // useEffect(() => {
  //   if (profile) {
  //     setSelectedRegion(
  //       regions.find(region => profile.region === region.name)!
  //     );
  //   }
  // }, [me, profile]);
  // const { data, loading: loadingDistrict } = useGetDistrictsQuery({
  //   variables: { regionId: selectedRegion.region }
  // });
  // const districts = data?.getDistricts || [];

  const [updateProfile, { called }] = useUpdateProfileMutation({
    refetchQueries: [{ query: MeDocument }],
    awaitRefetchQueries: true,
  });
  return (
    <>
      {' '}
      <Typography variant="h4">Edit Profile</Typography>
      <Formik
        enableReinitialize
        initialValues={{
          name: profile?.name || '',
          email: profile?.email || '',
          phone: profile?.phone || '',
          emergencyName: profile?.emergencyName || '',
          emergencyRelation: profile?.emergencyRelation || '',
          emergencyPhone: profile?.emergencyPhone || '',
          // region: profile?.region || '',
          // district: profile?.district || '',
          // street: profile?.street || '',
          detailedAddress: profile?.detailedAddress || '',
        }}
        validationSchema={Yup.object().shape({
          name: yupSchema.name,
          email: yupSchema.email,
          phone: yupSchema.phone,
          emergencyName: yupSchema.emergencyName,
          emergencyPhone: yupSchema.emergencyPhone,
          // region: yupSchema.region,
          // district: yupSchema.district,
          // street: yupSchema.street,
          detailedAddress: yupSchema.detailedAddress,
        })}
        onSubmit={async (values) => {
          await updateProfile({ variables: values });
        }}
        render={(props) => {
          const { isSubmitting, dirty } = props;
          // const selectedDistrict = districts.find(
          //   district => district.name === values.district
          // );
          // const streets = selectedDistrict?.streets || [];
          return (
            <Form>
              <Grid container spacing={4} direction="column">
                <Grid container item spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">Student detail</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <MyTextField name="name" type="text" label="Name" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MyTextField name="email" type="email" label="Email" />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <MyTextField
                      name="phone"
                      type="text"
                      label="Phone number"
                    />
                  </Grid>
                </Grid>
                <Grid container item spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">Emergency contact</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MyTextField
                      name="emergencyName"
                      type="text"
                      label="Name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MyTextField
                      name="emergencyRelation"
                      type="text"
                      label="Relation with student"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MyTextField
                      name="emergencyPhone"
                      type="text"
                      label="Phone Number"
                    />
                  </Grid>
                </Grid>
                <Grid container item spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">Address</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {/* <TextField
                      select
                      variant="standard"
                      fullWidth
                      name="region"
                      label="Region"
                      margin="none"
                      value={selectedRegion.name}
                      onChange={e => {
                        setSelectedRegion(
                          regions.find(
                            region => region.name === e.target.value
                          )!
                        );
                        setFieldValue('region', e.target.value);
                        setFieldValue('district', '');
                        setFieldValue('street', '');
                      }}
                      SelectProps={{
                        native: true,
                        disabled: loadingDistrict
                      }}
                    >
                      {regions.map(region => (
                        <option key={region.region} value={region.name}>
                          {region.name}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MyTextField
                      select
                      name="district"
                      type="text"
                      label="District"
                      SelectProps={{
                        native: true,
                        disabled: loadingDistrict
                      }}
                      onChange={e => {
                        setFieldValue('district', e.target.value);
                        const newDistrict = districts.find(
                          district => district.name === e.target.value
                        );
                        setFieldValue(
                          'street',
                          newDistrict?.streets[0]?.name || ''
                        );
                      }}
                    >
                      <option value=""></option>
                      {districts.map(district => (
                        <option key={district.district} value={district.name}>
                          {district.name}
                        </option>
                      ))}
                    </MyTextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MyTextField
                      select
                      name="street"
                      type="text"
                      label="Street"
                      disabled={streets.length === 0}
                      SelectProps={{ native: true }}
                    >
                      {streets.length === 0 && <option value=""></option>}
                      {streets.map(street => (
                        <option value={street.name} key={street.street}>
                          {street.name}
                        </option>
                      ))}
                    </MyTextField> */}
                  </Grid>
                  <Grid item xs={12}>
                    <MyTextField
                      name="detailedAddress"
                      type="text"
                      label="Address"
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disableRipple
                  disabled={isSubmitting || !dirty}
                >
                  {isSubmitting ? (
                    'Submitting'
                  ) : !dirty && called ? (
                    <Check />
                  ) : (
                    'Update'
                  )}
                </Button>
              </Grid>
            </Form>
          );
        }}
      />
    </>
  );
};
