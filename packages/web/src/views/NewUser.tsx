import {
  Button,
  Container,
  Grid,
  makeStyles,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import { useAuthContext } from 'context/auth';
import { Form, Formik, useField } from 'formik';
import React, { useState } from 'react';
import { useApolloClient } from 'react-apollo';
import { hot } from 'react-hot-loader/root';
import {
  CheckUsernameUsedDocument,
  CheckUsernameUsedQuery,
  CompleteProfileMutationVariables,
  useCompleteProfileMutation,
} from 'types/graphql';
import { yupSchema } from 'utils/yupSchema';
import * as Yup from 'yup';

// const regions = [
//   {
//     region: 1,
//     name: 'Hong Kong',
//   },
//   {
//     region: 2,
//     name: 'Kowloon',
//   },
//   {
//     region: 3,
//     name: 'New Territories',
//   },
// ];

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

const useStyles = makeStyles((theme) => ({
  root: {},
  form: {
    marginTop: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  formSection: {
    marginBottom: theme.spacing(3),
  },
  button: {
    marginLeft: theme.spacing(2),
  },
}));

const FormSectionGrid: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <Grid container spacing={1} className={classes.formSection}>
      {children}
    </Grid>
  );
};

const NewUser = () => {
  const classes = useStyles();

  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep((activeStep) => activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep((activeStep) => activeStep - 1);
  };
  const { me, logout } = useAuthContext();

  // const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  // const { data } = useGetDistrictsQuery({
  //   variables: { regionId: selectedRegion.region },
  // });
  // const districts = data?.getDistricts || [];
  const [completeProfile] = useCompleteProfileMutation();
  const client = useApolloClient();
  return (
    <Container maxWidth="sm" className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h5" align="center">
          Create account in Booking Demo
        </Typography>
        <Formik
          initialValues={
            {
              username: '',
              name: '',
              password: '',
              email: me?.email || '',
              phone: '',
              emergencyName: '',
              emergencyRelation: '',
              emergencyPhone: '',
              // region: selectedRegion.name,
              // district: '',
              // street: '',
              detailedAddress: '',
            } as CompleteProfileMutationVariables
          }
          validateOnChange={true}
          onSubmit={async (values) => {
            try {
              await completeProfile({
                variables: values,
              });
            } catch (e) {
              console.error(e);
            }
          }}
          validationSchema={Yup.object().shape({
            ...yupSchema,
            username: yupSchema.username.test(
              'username',
              'Username is used',
              async (username: string) => {
                if (!!username) {
                  const result = await client.query<CheckUsernameUsedQuery>({
                    query: CheckUsernameUsedDocument,
                    variables: {
                      username,
                    },
                  });
                  return !result.data.checkUsernameUsed;
                }
                return false;
              }
            ),
          })}
          render={(props) => {
            const { errors } = props;
            // const selectedDistrict = districts.find(
            //   district => district.name === values.district
            // );
            // const streets = selectedDistrict?.streets || [];
            return (
              <Form className={classes.form}>
                <Stepper activeStep={activeStep}>
                  <Step>
                    <StepLabel>Login detail</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Contact information</StepLabel>
                  </Step>
                </Stepper>

                {activeStep === 0 && (
                  <FormSectionGrid>
                    <Grid item xs={12}>
                      <MyTextField
                        name="username"
                        type="text"
                        label="Username"
                        placeholder="Choose a login username"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <MyTextField
                        name="password"
                        type="password"
                        label="Password"
                        placeholder="Between 8 and 20 characters"
                      />
                    </Grid>
                  </FormSectionGrid>
                )}
                {activeStep === 1 && (
                  <>
                    <FormSectionGrid>
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
                    </FormSectionGrid>
                    <Typography variant="h6">Emergency contact</Typography>
                    <FormSectionGrid>
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
                    </FormSectionGrid>
                    <Typography variant="h6">Address</Typography>
                    <FormSectionGrid>
                      {/* <Grid item xs={12}>
                        <TextField
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
                            native: true
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
                          SelectProps={{ native: true }}
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
                            <option
                              key={district.district}
                              value={district.name}
                            >
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
                        </MyTextField>
                      </Grid> */}
                      <Grid item xs={12}>
                        <MyTextField
                          name="detailedAddress"
                          type="text"
                          label="Address"
                        />
                      </Grid>
                    </FormSectionGrid>
                  </>
                )}
                <Grid container justify="flex-end">
                  <Button
                    className={classes.button}
                    color="secondary"
                    variant="contained"
                    onClick={logout}
                  >
                    Cancel and Logout
                  </Button>
                  {activeStep === 0 && (
                    <Button
                      className={classes.button}
                      onClick={() => {
                        handleNext();
                      }}
                      color="primary"
                      variant="contained"
                      disabled={!!errors.password || !!errors.username}
                    >
                      Next
                    </Button>
                  )}
                  {activeStep > 0 && (
                    <>
                      <Button
                        className={classes.button}
                        onClick={handleBack}
                        color="primary"
                        variant="text"
                      >
                        Back
                      </Button>
                      <Button
                        className={classes.button}
                        type="submit"
                        color="primary"
                        variant="contained"
                      >
                        Submit
                      </Button>
                    </>
                  )}
                </Grid>
              </Form>
            );
          }}
        />
      </Paper>
    </Container>
  );
};

export default hot(NewUser);
