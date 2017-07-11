import React from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import SingleEstimate from './SingleEstimate';
import styles from './styles.scss';

const Dashboard = (props) => {

  const renderEstimates = estimates =>
    estimates.map((estimate, key) =>
      <SingleEstimate estimate={estimate} key={key} />
    );

  return (
    <div className={styles.wrapper}>
      {renderEstimates(props.allEstimates)}
    </div>
  );
};


function mapStateToProps(state) {
  return {
    allEstimates: state.Main.allEstimates,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // ...bindActionCreators(actionsMain, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Dashboard));
