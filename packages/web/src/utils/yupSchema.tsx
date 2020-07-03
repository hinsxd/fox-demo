import * as Yup from 'yup';
export const yupSchema = {
  username: Yup.string()
    .min(6, 'Username must be longer than 6 characters')
    .max(14, 'Username must be shorter than 14 characters')
    .required(),
  // .test(
  //   'username',
  //   'Username is used',
  //   async (username: string) => {
  //     if (!!username) {
  //       const result = await client.query<CheckUsernameUsedQuery>({
  //         query: CheckUsernameUsedDocument,
  //         variables: {
  //           username
  //         }
  //       });
  //       return !result.data.checkUsernameUsed;
  //     }
  //     return false;
  //   }
  // ),

  name: Yup.string().required('Please enter your name.'),
  password: Yup.string()
    .min(8, 'Password must be longer than 8 characters')
    .max(20, 'Password must be shorter than 20 characters')
    .required(),
  email: Yup.string()
    .email('Incorrect email format.')
    .required('Please enter your contact email address.'),
  phone: Yup.string().required('Phone number cannot be empty.'),
  emergencyName: Yup.string().required(
    'Please enter emergency contact person.'
  ),
  emergencyRelation: Yup.string().required(
    'Please enter relation with student.'
  ),
  emergencyPhone: Yup.string().required(
    'Please enter emergency contact number.'
  ),
  // region: Yup.string().required('Please select a region'),
  // district: Yup.string().required('Please select a district'),
  // street: Yup.string(),
  detailedAddress: Yup.string(),
};
