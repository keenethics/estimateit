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
const TechnologiesType = new InputObjectType({
  name: 'TechnologiesType',
  fields: () => ({
    value: {
      type: StringType,
    },
    label: {
      type: StringType,
    },
    className: {
      type: StringType,
    },
  }),
});

const HeaderAddionalInputType = new InputObjectType({
  name: 'HeaderAddionalInputType',
  fields: {
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
      type: new ListType(TechnologiesType),
    },
  },
});

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

const HeaderInputType = new InputObjectType({
  name: 'HeaderInputType',
  fields: {
    headerAdditional: {
      type: HeaderAddionalInputType,
    },
    parentTaskId: {
      type: StringType,
    },
    tasks: {
      type: new ListType(TaskInputType),
    },
  },
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

const DevHoursInputType = new InputObjectType({
  name: 'DevHoursInputType',
  fields: {
    minHours: {
      type: StringType,
    },
    maxHours: {
      type: StringType,
    },
  },
});

const ContactsInputType = new InputObjectType({
  name: 'ContactsInputType',
  fields: {
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
  },
});

const MainInputType = new InputObjectType({
  name: 'MainInputType',
  fields: {
    moneyRate: {
      type: FloatType,
    },
    estimateOptions: {
      type: EstimateOptionsInputType,
    },
    devHours: {
      type: DevHoursInputType,
    },
    contacts: {
      type: ContactsInputType,
    },
  },
});

//
// EstimateInputType
//

const EstimateInputType = new InputObjectType({
  name: 'EstimateInputType',
  fields: {
    header: {
      type: HeaderInputType,
    },
    main: {
      type: MainInputType,
    },
  },
});

export default EstimateInputType;
