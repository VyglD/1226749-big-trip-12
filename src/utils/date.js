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
    [duration.days(), `D`],
    [duration.hours(), `H`],
    [duration.minutes(), `M`],
  ]
  .map(([number, letter]) => {
    return number ? `${String(number).padStart(2, `0`)}${letter}` : ``;
  })
  .filter(Boolean)
  .join(` `);
};

export const getFormattedTimeString = (time) => {
  if (!(time instanceof Date)) {
    return ``;
  }

  return moment(time).format(`DD/MM/YY HH:mm`);
};
