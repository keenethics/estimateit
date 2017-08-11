import gql from 'graphql-tag';

const estimateGeneralInfo = gql`
  query estimate($id: String) {
    estimate(id: $id) {
      _id
      owner {
        _id,
        name,
        email,
        status,
        __typename @skip(if: true)
      }
      userCanEditThisEstimate,
      contributors {
        _id,
        name,
        email,
        status,
        __typename @skip(if: true)
      }
      __typename @skip(if: true)
    }
  }
`;

export default estimateGeneralInfo;
