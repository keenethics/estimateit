import React from 'react';
import SingleEstimate from './SingleEstimate';

const Dashboard = () => {
  const testEstimates = [
    {
      clientName: 'Some guy',
      projectName: 'Some old sht',
      sprint: 2,
      date: new Date(),
    },
    {
      clientName: 'Some guy2',
      projectName: 'Some old sht2',
      sprint: 3,
      date: new Date(),
    },
  ];

  const renderEstimates = estimates =>
    estimates.map((estimate, key) =>
      <SingleEstimate estimate={estimate} key={key} />
    );

  return (
    <div>
      <p>Hello</p>
      {renderEstimates(testEstimates)}
    </div>
  )
}

export default Dashboard;
