export default {
  header: {
    tasks: [],
    parentTaskId: '',
    infoCollector: {},
  },
  main: {
    // TODO remove calculationData
    calculationData: {
      qa: 10,
      pm: 10,
      bugFixes: 10,
      risks: 10,
      completing: 100,
    },
    estimateOptions: {
      qa: 10,
      pm: 10,
      bugFixes: 10,
      risks: 10,
      completing: 100,
    },
    moneyRate: 25,
    devHours: {
      minHours: 0,
      maxHours: 0,
    },
    contacts: {
      email: '',
      pm: '',
      position: '',
      skype: '',
    },
  },
  loading: {
    items: [],
    isFetching: false,
    error: undefined,
  },
};
