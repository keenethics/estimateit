import _ from 'underscore';
import {
  CALCULATE_TOTOAL_HOURS,
  GENERAL_CALCULATION,
  CHANGE_ADDITIONAL_TIME,
  CHANGE_PROBABILITY_TIME,
} from '../constants/actionTypes';
import formatTime from '../components/libs/formatTime';

const nAry = (base = 2) => (length = 0) => {
  /**
   * Max value of each digit.
   */
  const range = base - 1;

  /**
   * Zero vector.
   */
  const zero = Array(length).fill(0);

  /**
   * The last vector.
   */
  const last = Array(length).fill(range);

  /**
   * A random vector.
   */
  const random = () => zero.map(() => Math.floor(Math.random() * base));

  /**
   * A (base)-ary incrementation of a (vector)
   *
   * @param {array} vector - A vector to be incremented.
   */
  const inc = (vector) => {
    const index = vector.findIndex(digit => digit < range);
    return index === -1 ? (
      zero
    ) : [
      ...Array(index).fill(0),
      vector[index] + 1,
      ...vector.filter((_, i) => i > index)
    ];
  }

  /**
   * Brute force.
   */
  const all = () => {
    const vectors = [zero];
    for (let i = 1; i < Math.pow(base, length); i++) {
      vectors.push(inc(vectors[i - 1]));
    }
    return vectors;
  }

  /**
   * Generates just the (base)-ary verge of the (length)-dimension table.
   */
  // const verge = length => {
  //   const vectors = [last(length)];
  //   for (let i = 1; i < Math.pow(base, length) - Math.pow(range, length); i++) {
  //     const vector = inc(vectors[i - 1]);
  //
  //     console.log(Math.pow(base, length) - Math.pow(range, length), vector);
  //
  //     if (vector.some(digit => digit === range)) vectors.push(vector);
  //   }
  //   return vectors;
  // }
  const verge = () => all().filter(vector => vector.some(digit => digit === range));

  /**
   * Set of (count) random vectors.
   *
   * @param {number} count - Count of vectors to output.
   */
  const randomSet = count => Array(count).fill().map(() => random());

  /**
   * Converts (base)-ary vector as a number to decimal.
   */
  const index = vector => vector.reduce((sum, item, i) => sum + item * Math.pow(base, i), 0);

  /**
   * Coerces base-10 number to (base)-ary (length)-large vector.
   *
   * @param {number} value - Decimal number to convert.
   */
  const fromDecimal = (value = 0) => Array(value).fill().reduce(prev => inc(prev), zero);

  const sumOfDigits = vector => vector.reduce((sum, item) => sum + +item, 0);

  /**
   * Returns all vectors with specified sum of digits value.
   *
   * @param {number} value - Decimal number, which the sum of digits must be equals to.
   */
  const sumEquals = value => all().filter(vector => sumOfDigits(vector) === value);

  /**
   * Generates chunks of datasets.
   */
  // const chunk = maxChunkCount => ...

  return {
    base,
    length,
    range,
    zero,
    last,
    random,
    inc,
    all,
    verge,
    randomSet,
    index,
    fromDecimal,
    sumOfDigits,
    sumEquals,
  };
};

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
  const array = nAry(2)(tasks.length);
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
      additionalMinutes = additionalMinutes + additionalTime[field];
    });

    const a = additionalMinutes + probabilityTime;
    const minutes = a % 60;
    const res = ((a - minutes) / 60);

    const totalHours = minutes >= 30 ? res + 1 : res;

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

    dispatch(actionCalculateTotalHours(form));
  };


export const actionChangeProbability = ({ form }) =>
  (dispatch, getState) => {
    const state = getState();
    const { calculation: { time, percents, additionalTime } } = state;

    const { values: { estimateOptions: { probability } } } = state.form[form];


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

    dispatch(actionCalculateTotalHours(form));
  };

export const actionGeneralCalculation = form =>
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
    dispatch(actionChangeProbability({ form }));
  };
