import gql from 'graphql-tag';

const estimateRemove = gql`
  mutation Mutation (
    $id: String!
  ) {
    estimateRemove (
      id: $id
    )
  },
`;

export default estimateRemove;
