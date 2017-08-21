const MINUTESINHOUR = 60;


const formatTime = (digit) => {
  if (!digit) {
    return {
      hours: 0,
      minutes: 0,
      formattedValue: '',
      fromatedDigitValue: 0,
    };
  }
  if (typeof digit === 'object') {
    const fromatedDigitValue = digit.hours + (digit.minutes / 100);

    return {
      totalMinutes: digit.totalMinutes,
      hours: digit.hours,
      minutes: digit.minutes,
      formattedValue: `${digit.hours}${digit.minutes}`,
      fromatedDigitValue,
    };
  }
  let hours;
  let minutes;
  let formattedValue;
  let tempDigit = digit;

  if (typeof digit === 'number') {
    tempDigit = (Math.round(digit * 100) / 100).toString();
  }

  // TempDigit does not include any letters
  if (tempDigit && tempDigit.match(/\d+/) && !tempDigit.match(/[a-zA-z]/)) {
    if (tempDigit.match(/\d+.\d+/)) {
      const indexOfHours = 0;
      const indexOfMinutes = 1;
      const minutesAndHours = tempDigit.split('.');
      if (minutesAndHours.length === 1) {
        minutesAndHours[1] = 0;
      }
      if (minutesAndHours[indexOfMinutes] && minutesAndHours[indexOfMinutes].length > 2) {
        minutesAndHours[indexOfMinutes] = minutesAndHours[indexOfMinutes].slice(0, 2);
      }
      hours = parseInt(minutesAndHours[indexOfHours], 10);
      minutes = parseInt(minutesAndHours[indexOfMinutes], 10);

      if (minutesAndHours[indexOfMinutes] && (minutesAndHours[indexOfMinutes])[0] !== '0' && (minutesAndHours[indexOfMinutes]).length !== 2) {
        minutes *= 10;
      }
      if (minutes >= MINUTESINHOUR) {
        hours += (Math.floor(minutes / MINUTESINHOUR));
        minutes %= MINUTESINHOUR;
      }

      const formattedHours = hours ? `${hours} h ` : '';
      const formattedMinutes = minutes ? `${minutes} m` : '';
      formattedValue = `${formattedHours}${formattedMinutes}`;
      const fromatedDigitValue = hours + (minutes / 100);
      const totalMinutes = (hours * 60) + minutes;
      return {
        totalMinutes,
        hours,
        minutes,
        formattedValue,
        fromatedDigitValue,
      };
    }
    hours = parseInt(tempDigit.match(/\d+/) && (tempDigit.match(/\d+/))[0], 10);
    formattedValue = hours ? `${hours} h` : '';
    const totalMinutes = (hours * 60);
    return {
      totalMinutes,
      hours,
      minutes: 0,
      formattedValue,
      fromatedDigitValue: hours,
    };
  }

  // TempDigit include letters
  hours = tempDigit.match(/\d+(\s+)?h/);
  minutes = tempDigit.match(/\d+(\s+)?m/);
  hours = hours && hours[0] ? parseInt(hours[0], 10) : 0;
  minutes = minutes && minutes[0] ? parseInt(minutes[0], 10) : 0;

  if (minutes >= MINUTESINHOUR) {
    hours += (Math.floor(minutes / MINUTESINHOUR));
    minutes %= MINUTESINHOUR;
  }

  const formattedHours = hours ? `${hours} h ` : '';
  formattedValue = minutes ? `${formattedHours}${minutes} m` : `${formattedHours}`;
  const fromatedDigitValue = hours + (minutes / 100);
  const totalMinutes = (hours * 60) + minutes;
  return {
    totalMinutes,
    hours,
    minutes,
    formattedValue,
    fromatedDigitValue,
  };
};

export default formatTime;
