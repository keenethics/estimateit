import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';

const EstimateCreateType = new ObjectType({
  name: 'estimate',
  fields: {
    url: {
        type: StringType
    },
  },
});


// projectName: {
//     type: StringType
// },
// data: {
//     type: StringType
// },
// sprintNumber: {
//     type: StringType
// },
// technologies: {
//     type: StringType
// },
// comments: {
//     type: StringType
// },
// Main: { type: ObjectType },
// Header: { type: ObjectType },
// original: { type: StringType },
export default EstimateCreateType;
