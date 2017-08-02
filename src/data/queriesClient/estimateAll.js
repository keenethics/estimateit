import gql from 'graphql-tag';

const estimateAll = gql`
query allEstimates {
  allEstimates {
    _id
    date
    clientName
    projectName
    sprintNumber
  }
}
`;

export default estimateAll;
