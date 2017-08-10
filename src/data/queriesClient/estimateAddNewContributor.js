import gql from 'graphql-tag';

const estimateAddNewContributor = gql`
  mutation Mutation (
    $input: EstimateAddNewContributorInputType
  ) {
    estimateAddNewContributor (
      input: $input
    ) {
      _id,
      name,
      email,
      status,
    }
  },
`;

export default estimateAddNewContributor;
