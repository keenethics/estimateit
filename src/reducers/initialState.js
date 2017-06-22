export default {
  header: {
    tasks: [],
    parentTaskId: '',
    infoCollector: {
      selectedTechnologies: [],
    },
  },
  main: {
    estimateOptions: {
      qa: 10,
      pm: 10,
      risks: 10,
      bugFixes: 10,
      completing: 100,
    },
    moneyRate: 25,
    devHours: {
      minHours: 0,
      maxHours: 0,
    },
    contacts: {
      pm: '',
      skype: '',
      email: '',
      position: '',
    },
  },
  loading: {
    items: [],
    error: undefined,
    isFetching: false,
  },
};
