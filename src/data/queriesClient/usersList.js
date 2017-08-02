import gql from 'graphql-tag';

const usersLIst = gql`
  query usersList {
    usersList {
      _id,
      name,
      email,
    }
  },
`;

export default usersLIst;
