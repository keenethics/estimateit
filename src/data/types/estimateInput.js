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
    minimumMinutes: {
      type: FloatType,
    },
    maximumMinutes: {
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
    probability: {
      type: FloatType,
    },
  },
});


//
// EstimateInputType
//


const OwnerInputType = new InputObjectType({
  name: 'OwnerInputType',
  fields: () => ({
    _id: {
      type: StringType,
    },
    name: {
      type: StringType,
    },
    email: {
      type: StringType,
    },
  }),
});

const EstimateInputType = new InputObjectType({
  name: 'EstimateInputType',
  fields: {
    _id: {
      type: StringType,
    },
    owner: {
      type: OwnerInputType,
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
    solutionScope: {
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
