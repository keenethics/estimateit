/* eslint global-require:  */
export default [
  {
    path: '/',
    title: 'Dashboard',
    children: [
      require('./dashboard').default,
      require('./policy').default,
      require('./estimate').default,
      require('./notFound').default,
    ],
    async action({ next }) {
      const route = await next();
      route.title = `${route.title || 'Untitled Page'}`;
      route.description = route.description || '';
      return route;
    },
  }];
