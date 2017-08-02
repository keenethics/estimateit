import {
  GraphQLList as ListType,
  GraphQLFloat as FloatType,
  GraphQLBoolean as BoolType,
  GraphQLString as StringType,
  GraphQLInputObjectType as InputObjectType,
} from 'graphql';

const TaskInputType = new InputObjectType({
  name: 'TaskInputType',
  fields: () => ({
    taskName: {
      type: StringType,
    },
    minimumHours: {
      type: FloatType,
    },
    maximumHours: {
      type: FloatType,
    },
    isChecked: {
      type: BoolType,
    },
    tasks: {
      type: new ListType(TaskInputType),
    },
  }),
});

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
    _id: {
      type: StringType,
    },
    owner: {
      type: StringType,
    },
    date: {
      type: StringType,
    },
    clientName: {
      type: StringType,
    },
    projectName: {
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
      type: FloatType,
    },
    estimateOptions: {
      type: EstimateOptionsInputType,
    },
    tasks: {
      type: new ListType(TaskInputType),
    },
    isRemoved: {
      type: BoolType,
    },
  },
});

export default EstimateInputType;
