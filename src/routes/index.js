export default [
  {
    path: '/',
    title: 'Dashboard',
    children: [
      require('./dashboard').default,
      require('./login').default,
      require('./register').default,
      require('./estimate').default,
      require('./notFound').default,
    ],
    async action({ next, isAuthenticated }) {
      const route = await next();
      route.title = `${route.title || 'Untitled Page'}`;
      route.description = route.description || '';
      if (route.authRequired && !isAuthenticated) {
        return { redirect: '/login' };
      }
      if (route.denyAuth && isAuthenticated) {
        return { redirect: '/' };
      }
      return route;
    },
  }];
