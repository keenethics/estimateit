import gql from 'graphql-tag';

const estimateRemoveContributor = gql`
  mutation Mutation (
    $input: estimateRemoveContributor
  ) {
    estimateRemoveContributor (
      input: $input
    )
  },
`;

export default estimateRemoveContributor;
