import _ from 'underscore';
import {
  GENERAL_CALCULATION,
  CHANGE_ADDITIONAL_TIME,
  CALCULATE_TOTOAL_HOURS,
  CHANGE_PROBABILITY_TIME,
} from '../constants/actionTypes';
import formatTime from '../components/libs/formatTime';
import nArray from '../core/nArray';


const actionCalculateAllPossibilityTimes = (tasks) => {
  if (tasks.length === 0) return [0, 0];

  if (tasks.length === 1) {
    const {
      minimumMinutes = 0,
      maximumMinutes = 0,
    } = tasks[0];

    return [minimumMinutes, maximumMinutes];
  }
  const maxNumberOfTask = 12;
  const array = nArray(2)(tasks.length);
  const allComputations = tasks.length < maxNumberOfTask
    ? array.all()
    : array.randomSet(2 ** (maxNumberOfTask - 1));

  // allComputations.push(array.zero, array.last);

  return allComputations.map((computation) => {
    if (!computation.length) return 0;

    const sum = computation.reduce((acumulate, item, index) => {
      let value;
      let minOrMax;
      let result = acumulate;

      if (index === 1) {
        minOrMax = acumulate ? 'maximumMinutes' : 'minimumMinutes';
        value = tasks[0][minOrMax] || 0;
        result = parseFloat(value, 10);
      }

      minOrMax = item ? 'maximumMinutes' : 'minimumMinutes';
      value = tasks[index][minOrMax] || 0;

      return result + parseFloat(value, 10);
    });

    return formatTime(sum).fromatedDigitValue;
  }).sort((a, b) => a - b);
};

export const actionCalculateTotalHours = () =>
  (dispatch, getState) => {
    const state = getState();
    const { calculation: {
      additionalTime,
      probabilityTime,
    } } = state;

    let additionalMinutes = 0;
    _.keys(additionalTime).forEach((field) => {
      additionalMinutes += additionalTime[field];
    });

    const totalTime = additionalMinutes + probabilityTime;
    const minutes = totalTime % 60;
    let totalHours = ((totalTime - minutes) / 60);
    totalHours = minutes >= 30 ? totalHours + 1 : totalHours;

    dispatch({
      type: CALCULATE_TOTOAL_HOURS,
      payload: {
        totalHours,
      },
    });
  };

export const actionChangeAdditionalTime = ({ field, form }) =>
  (dispatch, getState) => {
    const state = getState();
    const { probabilityTime } = state.calculation;
    const value = state.form[form].values.estimateOptions[field];

    const additionalTime = Math.round((value * probabilityTime) / 100);

    dispatch({
      type: CHANGE_ADDITIONAL_TIME,
      payload: {
        [field]: additionalTime,
      },
    });

    dispatch(actionCalculateTotalHours());
  };


export const actionChangeProbabilityTime = ({ form }) =>
  (dispatch, getState) => {
    const state = getState();
    const { calculation: { time, percents, additionalTime } } = state;

    const { probability } = state.form[form].values.estimateOptions;


    let highestIndex = percents.findIndex(item => item >= probability);

    if (highestIndex === -1) {
      highestIndex = percents.length - 1;
    }

    const probabilityTime = time[highestIndex];
    const probabilityPercent = percents[highestIndex];
    dispatch({
      type: CHANGE_PROBABILITY_TIME,
      payload: {
        probabilityTime,
        probabilityPercent,
      },
    });

    _.keys(additionalTime).forEach(field =>
      dispatch(actionChangeAdditionalTime({ field, form })),
    );

    dispatch(actionCalculateTotalHours());
  };

export const actionGeneralCalculation = ({ form }) =>
  (dispatch, getState) => {
    const { values: { tasks } } = getState().form[form];
    const checkedTasks = tasks.filter(({ isChecked }) => isChecked);
    const time = actionCalculateAllPossibilityTimes(checkedTasks);
    const percents = time.map((item, i) =>
      Math.round((100 * i) / (time.length - 1)),
    );

    const devTimes = {
      minHours: time[0],
      maxHours: time[time.length - 1],
    };

    dispatch({
      type: GENERAL_CALCULATION,
      payload: {
        time,
        percents,
        devTimes,
      },
    });
    dispatch(actionChangeProbabilityTime({ form }));
  };
