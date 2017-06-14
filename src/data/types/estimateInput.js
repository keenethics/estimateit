import {
  GraphQLList as ListType,
  GraphQLString as StringType,
  GraphQLInputObjectType as InputObjectType,
} from 'graphql';

//
// HEADER
//

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
      type: StringType,
    },
    technologies: {
      type: StringType,
    },
    comments: {
      type: StringType,
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
      type: StringType,
    },
    maximumHours: {
      type: StringType,
    },
    parent: {
      type: StringType,
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
      type: StringType,
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
