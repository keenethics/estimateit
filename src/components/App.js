import React from 'react';
import PropTypes from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import bt from 'bootstrap/dist/css/bootstrap.css?root=./node_modules/bootstrap/dist/';
import styles from '../routes/home/styles.scss';

const ContextType = {
  client: PropTypes.object.isRequired,
  insertCss: PropTypes.func.isRequired,
  fetch: PropTypes.func.isRequired,
  ...ReduxProvider.childContextTypes,
};

/**
 * The top-level React component setting context (global) variables
 * that can be accessed from all the child components.
 *
 * https://facebook.github.io/react/docs/context.html
 *
 * Usage example:
 *
 *   const context = {
 *     history: createBrowserHistory(),
 *     store: createStore(),
 *   };
 *
 *   ReactDOM.render(
 *     <App context={context}>
 *       <Layout>
 *         <LandingPage />
 *       </Layout>
 *     </App>,
 *     container,
 *   );
 */
class App extends React.PureComponent {

  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired,
  };

  static childContextTypes = ContextType;

  getChildContext() {
    return this.props.context;
  }
  componentWillMount() {
    const { insertCss } = this.props.context;
    this.removeBootstrap = insertCss(bt, styles);
  }
  componentWillUnmount() {
    this.removeBootstrap();
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

export default App;
