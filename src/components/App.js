import React from 'react';
import PropTypes from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import bt from 'bootstrap/dist/css/bootstrap.css';
import styles from '../routes/home/styles.scss';

const ContextType = {
  client: PropTypes.object.isRequired,
  insertCss: PropTypes.func.isRequired,
  fetch: PropTypes.func.isRequired,
  ...ReduxProvider.childContextTypes,
};


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
