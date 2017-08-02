import gql from 'graphql-tag';

const estimateAddNewContributor = gql`
  mutation Mutation (
    $input: estimateAddNewContributor
  ) {
    estimateAddNewContributor (
      input: $input
    )
  },
`;

export default estimateAddNewContributor;
