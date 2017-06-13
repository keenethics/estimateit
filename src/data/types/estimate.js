import {
  GraphQLInputObjectType,
  GraphQLList as ListType,
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
  GraphQLScalarType as ScalarType,
} from 'graphql';

//
//HEADER
//

const HeaderAddionalType = new GraphQLInputObjectType({
  name: 'HeaderAddionalType',
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
  }
});

const TaskType = new GraphQLInputObjectType({
  name: 'TaskType',
  fields: {
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
  }
});

const HeaderType  = new GraphQLInputObjectType({
  name: 'HeaderType',
  fields: {
    headerAdditional: {
      type: HeaderAddionalType,
    },
    parentTaskId: {
      type: StringType
    },
    tasks: {
      type: new ListType(TaskType)
    },
  }
});


//
// MAIN
//


const EstimateOptionsType = new GraphQLInputObjectType({
  name: 'EstimateOptionsType',
  fields: {
    qa: {
      type: StringType
    },
    pm: {
      type: StringType
    },
    risks: {
      type: StringType
    },
    bugFixes: {
      type: StringType
    },
    completing: {
      type: StringType
    },
  }
});

const DevHoursType = new GraphQLInputObjectType({
  name: 'DevHoursType',
  fields: {
    minHours: {
      type: StringType
    },
    maxHours: {
      type: StringType
    },
  }
});

const ContactsType = new GraphQLInputObjectType({
  name: 'ContactsType',
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
  }
});

const MainType = new GraphQLInputObjectType({
  name: 'MainType',
  fields: {
    moneyRate: {
      type: StringType,
    },
    estimateOptions: {
      type: EstimateOptionsType
    },
    devHours: {
      type: DevHoursType,
    },
    contacts: {
      type: ContactsType,
    }
  }
})


const EstimateType =  new GraphQLInputObjectType({
  name: 'EstimateType',
  fields: {
    header: {
      type: HeaderType,
    },
    main: {
      type: MainType,
    }
  }
});

export default EstimateType;
