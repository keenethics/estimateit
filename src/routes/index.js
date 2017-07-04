export default [
  {
    path: '/',
    title: 'Dashboard',
    children: [
      require('./dashboard').default,
    ],
  }, {
    path: '/estimate',
    children: [
      require('./home').default,
      require('./estimate').default,
      require('./notFound').default,
    ],
    async action({ next }) {
    // Execute each child route until one of them return the result
      const route = await next();
    // Provide default values for title, description etc.
      route.title = `${route.title || 'Untitled Page'} - www.reactstarterkit.com`;
      route.description = route.description || '';
      return route;
    },
  }, {
    path: '/login',
    title: 'Login',
    children: [
      require('./login').default,
    ],
  }, {
    path: '/register',
    title: 'Register',
    children: [
      require('./register').default,
    ],
  }];
