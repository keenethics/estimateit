import {
  GraphQLList as ListType,
  GraphQLBoolean as BoolType,
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
} from 'graphql';

//
// HEADER
//

const TaskOutputType = new ObjectType({
  name: 'TaskOutputType',
  fields: () => ({
    id: {
      type: StringType,
    },
    taskName: {
      type: StringType,
    },
    minimumHours: {
      type: StringType,
    },
    maximumHours: {
      type: StringType,
    },
    parent: {
      type: StringType,
    },
    isChecked: {
      type: BoolType,
    },
    tasks: {
      type: new ListType(TaskOutputType),
    },
  }),
});

//
// MAIN
//

const EstimateOptionsOutputType = new ObjectType({
  name: 'EstimateOptionsOutputType',
  fields: {
    qa: {
      type: StringType,
    },
    pm: {
      type: StringType,
    },
    risks: {
      type: StringType,
    },
    bugFixes: {
      type: StringType,
    },
    completing: {
      type: StringType,
    },
  },
});

//
// EstimateOutputType
//

const EstimateOutputType = new ObjectType({
  name: 'EstimateOutputType',
  fields: {
    date: {
      type: StringType,
    },
    clientName: {
      type: StringType,
    },
    projectName: {
      type: StringType,
    },
    data: {
      type: StringType,
    },
    sprintNumber: {
      type: StringType,
    },
    comments: {
      type: StringType,
    },
    technologies: {
      type: new ListType(StringType),
    },
    pm: {
      type: StringType,
    },
    skype: {
      type: StringType,
    },
    email: {
      type: StringType,
    },
    position: {
      type: StringType,
    },
    moneyRate: {
      type: StringType,
    },
    estimateOptions: {
      type: EstimateOptionsOutputType,
    },
    tasks: {
      type: new ListType(TaskOutputType),
    },
  },
});

export default EstimateOutputType;
