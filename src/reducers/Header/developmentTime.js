import initialState from '../initialState';
import * as types from '../../constants/actionTypes';
import nAry from '../../core/nAray';

const calculateHours = (tasks) => {
  let arrayOfSubtasksAndTasks = [];

  function getAllSubtasksFrom(arrayOfTasks) {
    arrayOfTasks.forEach((task) => {
      if (task.tasks && task.tasks.length > 0) {
        arrayOfSubtasksAndTasks = arrayOfSubtasksAndTasks.concat(task.tasks);
        getAllSubtasksFrom(task.tasks);
      }
    });
  }

  getAllSubtasksFrom(tasks);
  tasks = tasks.concat(arrayOfSubtasksAndTasks);
  tasks = tasks.filter(task => task.isChecked);


  let time = [];

  if (tasks.length > 1) {
    const allComputations = nAry(2)(tasks.length).all();

    time = allComputations.map((computation) => {
      const sumOfComputation = computation.reduce((acumulate, item, index) => {
        let minOrMax;
        let result = acumulate;

        if (index === 1) {
          minOrMax = acumulate ? 'maximumHours' : 'minimumHours';
          result = +tasks[0][minOrMax];
        }
        minOrMax = item ? 'maximumHours' : 'minimumHours';

        return result + +tasks[index][minOrMax];
      });

      return sumOfComputation;
    }).sort((a, b) => a - b);
  } else if (tasks.length) {
    const { minimumHours, maximumHours } = tasks[0];
    time = [minimumHours, maximumHours];
  }

  return time;
};


const calculate = ({ payload: { tasks, estimateOptions } }) => {
  const time = calculateHours(tasks);

  //////////////////////// percent

  const percent = time.map((item, i) =>
    Math.round(100 * i / (time.length - 1)),
  );
  //////////////////////// total hours


  const {
    pm,
    qa,
    risks,
    bugFixes,
    completing,
  } = estimateOptions;

  let highestIndex = percent.findIndex(item => item > completing);

  if (highestIndex === -1) {
    highestIndex = percent.length - 1;
  }
  const developmentHours = time[highestIndex];

  const additionalHourse = developmentHours * (pm + qa + bugFixes + risks) / 100;

  const totalHours = Math.round(developmentHours + additionalHourse);

  const devHours = {
    minHours: time[0],
    maxHours: time[time.length-1],
  }

  return { time, percent, totalHours, devHours };
};


export default function developmentTime(state = initialState.header.developmentTime, action) {
  switch (action.type) {
    case types.UPDATE_DEVELOPMENT_TIME:
      return calculate(action);

    default:
      return state;
  }
}
