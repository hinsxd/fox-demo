import gql from 'graphql-tag';
import { userFragment } from 'apollo/user/fragment/userFragment';
export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile(
    $email: String
    $name: String
    $phone: String
    $emergencyName: String
    $emergencyRelation: String
    $emergencyPhone: String
    # $region: String
    # $district: String
    # $street: String
    $detailedAddress: String
  ) {
    updateProfile(
      name: $name
      email: $email
      phone: $phone
      emergencyName: $emergencyName
      emergencyRelation: $emergencyRelation
      emergencyPhone: $emergencyPhone
      # region: $region
      # district: $district
      # street: $street
      detailedAddress: $detailedAddress
    ) {
      ...userFragment
    }
  }
  ${userFragment}
`;
