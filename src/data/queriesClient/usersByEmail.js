import gql from 'graphql-tag';

const usersByEmail = gql`
  query usersByEmail(
    $email: String,
  ) {
    usersByEmail(
      email: $email,
    ) {
      _id,
      email,
      name,
    }
  },
`;

export default usersByEmail;
