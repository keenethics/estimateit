import gql from 'graphql-tag';

const estimateFormValues = gql`
  query estimate($id: String) {
    estimate(id: $id) {
      _id
      owner
      date
      userCanEditThisEstimate,
      clientName
      projectName
      sprintNumber
      comments
      pm
      skype
      email
      position
      moneyRate
      technologies
      contributors {
        userId
        username
        userEmail
        __typename @skip(if: true)
      }
      estimateOptions {
        qa
        pm
        risks
        bugFixes
        completing
        __typename @skip(if: true)
      }
      tasks {
        taskName
        isChecked
        minimumHours
        maximumHours
        __typename @skip(if: true)
        tasks {
          taskName
          isChecked
          minimumHours
          maximumHours
          __typename @skip(if: true)
          tasks {
            taskName
            isChecked
            minimumHours
            maximumHours
            __typename @skip(if: true)
          }
        }
      }
      __typename @skip(if: true)
    }
  }
`;

export default estimateFormValues;
