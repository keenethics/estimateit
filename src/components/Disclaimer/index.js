import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Card,
  // Button,
  CardBlock,
  // ListGroup,
  CardHeader,
  // ListGroupItem,
} from 'reactstrap';

// import * as styles from './styles.scss';

export default () => (
  <Card>
    <CardHeader>Disclaimer / Notice / ?</CardHeader>
    <CardBlock>
      <p>Current estimate document is a subject to change due to the following:</p>
      <p>Every additional request that wasn't initially within the estimated scope as well as improvements will be considered as an additional work load. The timeline will be extended accordingly to a cost increasement.</p>
      <p>Examination has to be applied before adding changes, new estimate for project completion will be presented.</p>
    </CardBlock>
  </Card>
);
