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

const headerAddionalType = new GraphQLInputObjectType({
  name: 'headerAddional',
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

const taskType = new GraphQLInputObjectType({
  name: 'taskType',
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
  name: 'headerType',
  fields: {
    headerAdditional: {
      type: headerAddionalType,
    },
    parentTaskId: {
      type: StringType
    },
    tasks: {
      type: new ListType(taskType)
    },
  }
});


//
// MAIN
//


const estimateOptionsType = new GraphQLInputObjectType({
  name: 'estimateOptionsType',
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

const devHoursType = new GraphQLInputObjectType({
  name: 'devHoursType',
  fields: {
    minHours: {
      type: StringType
    },
    maxHours: {
      type: StringType
    },
  }
});

const contactsType = new GraphQLInputObjectType({
  name: 'contactsType',
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
  name: 'mainType',
  fields: {
    moneyRate: {
      type: StringType,
    },
    estimateOptions: {
      type: estimateOptionsType
    },
    devHours: {
      type: devHoursType,
    },
    contacts: {
      type: contactsType,
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
