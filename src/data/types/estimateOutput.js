import {
  GraphQLList as ListType,
  GraphQLBoolean as BoolType,
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
} from 'graphql';

//
// HEADER
//

const HeaderAddionalOutputType = new ObjectType({
  name: 'HeaderAddionalOutputType',
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

const HeaderOutputType = new ObjectType({
  name: 'HeaderOutputType',
  fields: {
    headerAdditional: {
      type: HeaderAddionalOutputType,
    },
    parentTaskId: {
      type: StringType,
    },
    tasks: {
      type: new ListType(TaskOutputType),
    },
  },
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

const DevHoursOutputType = new ObjectType({
  name: 'DevHoursOutputType',
  fields: {
    minHours: {
      type: StringType,
    },
    maxHours: {
      type: StringType,
    },
  },
});

const ContactsOutputType = new ObjectType({
  name: 'ContactsOutputType',
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

const MainOutputType = new ObjectType({
  name: 'MainOutputType',
  fields: {
    moneyRate: {
      type: StringType,
    },
    estimateOptions: {
      type: EstimateOptionsOutputType,
    },
    devHours: {
      type: DevHoursOutputType,
    },
    contacts: {
      type: ContactsOutputType,
    },
  },
});

//
// EstimateOutputType
//

const EstimateOutputType = new ObjectType({
  name: 'EstimateOutputType',
  fields: {
    owner: {
      type: StringType,
    },
    header: {
      type: HeaderOutputType,
    },
    main: {
      type: MainOutputType,
    },
  },
});

export default EstimateOutputType;
