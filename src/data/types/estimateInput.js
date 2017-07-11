import {
  GraphQLList as ListType,
  GraphQLFloat as FloatType,
  GraphQLBoolean as BoolType,
  GraphQLString as StringType,
  GraphQLInputObjectType as InputObjectType,
} from 'graphql';

//
// HEADER
//

const TaskInputType = new InputObjectType({
  name: 'TaskInputType',
  fields: () => ({
    id: {
      type: StringType,
    },
    taskName: {
      type: StringType,
    },
    minimumHours: {
      type: FloatType,
    },
    maximumHours: {
      type: FloatType,
    },
    parent: {
      type: StringType,
    },
    isChecked: {
      type: BoolType,
    },
    tasks: {
      type: new ListType(TaskInputType),
    },
  }),
});

//
// MAIN
//

const EstimateOptionsInputType = new InputObjectType({
  name: 'EstimateOptionsInputType',
  fields: {
    qa: {
      type: FloatType,
    },
    pm: {
      type: FloatType,
    },
    risks: {
      type: FloatType,
    },
    bugFixes: {
      type: FloatType,
    },
    completing: {
      type: FloatType,
    },
  },
});


//
// EstimateInputType
//

const EstimateInputType = new InputObjectType({
  name: 'EstimateInputType',
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
      type: FloatType,
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
      type: FloatType,
    },
    estimateOptions: {
      type: EstimateOptionsInputType,
    },
    tasks: {
      type: new ListType(TaskInputType),
    },
  },
});

export default EstimateInputType;
