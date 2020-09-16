import moment from "moment";

export const getDateAtShortFormat = (date) => {
  return moment(date).format(`MMM DD`);
};

export const getTripDateInterval = (points) => {
  if (!points.length) {
    return ``;
  }

  const start = points[0].timeStart;
  const end = points[points.length - 1].timeEnd;

  const endString = start.getMonth() === end.getMonth()
    ? moment(end).format(`DD`)
    : moment(end).format(`DD MMM`);

  return `${getDateAtShortFormat(start)}&nbsp;&mdash;&nbsp;${endString}`;
};

export const getSystemFormattedDate = (date) => {
  return moment(date).format(`YYYY-DD-MM`);
};

export const getHumanizeTime = (time) => {
  return moment(time).format(`HH:mm`);
};

export const getHumanizeTimeInterval = (interval) => {
  const duration = moment.duration(interval);

  return [
    [Math.floor(duration.asDays()), `D`],
    [duration.hours(), `H`],
    [duration.minutes(), `M`]
  ]
  .reduce((result, [number, letter], index, durations) => {
    return (number || result.length || (index === (durations.length - 1) && !result.length))
      ? `${result} ${String(number).padStart(2, `0`)}${letter}`
      : result;
  }, ``)
  .trim();
};

export const getFormattedTimeString = (time) => {
  if (!(time instanceof Date)) {
    return ``;
  }

  return moment(time).format(`DD/MM/YY HH:mm`);
};

export const getBlankDate = (existingDate = new Date()) => {
  const blankDate = new Date(existingDate);
  blankDate.setHours(0, 0, 0, 0);
  return blankDate;
};
