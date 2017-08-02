import gql from 'graphql-tag';

const estimateUpdate = gql`
  mutation Mutation (
    $input: EstimateInputType
  ) {
    estimateUpdate (
      input: $input
    )
  },
`;

export default estimateUpdate;
