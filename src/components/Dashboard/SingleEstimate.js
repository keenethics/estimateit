import React from 'react';

const SingleEstimate = (props) => {
  return (
    <div>
      <div>{props.estimate.clientName}</div>
      <div>{props.estimate.projectName}</div>
      <div>{props.estimate.sprint}</div>
      <div>{props.estimate.date.toString()}</div>
    </div>
  )
};

export default SingleEstimate;
