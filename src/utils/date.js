import {getRandomInteger} from "./common";
import moment from "moment";

const DAY_SHIFT = 1;
const MAX_MINUTES = 59;
const MAX_HOURS = 23;
const MIN_HOURS = 1;

export const generateTimeInterval = () => {
  const start = new Date();
  const end = new Date();
  const negativeShift = getRandomInteger(-DAY_SHIFT, DAY_SHIFT);
  const positiveShift = getRandomInteger(negativeShift, DAY_SHIFT);

  start.setDate(start.getDate() + negativeShift);
  end.setDate(end.getDate() + positiveShift);

  start.setHours(
      getRandomInteger(MIN_HOURS, MAX_HOURS),
      getRandomInteger(0, MAX_MINUTES),
      0,
      0
  );

  end.setHours(
      getRandomInteger(start.getHours(), MAX_HOURS),
      getRandomInteger(start.getMinutes(), MAX_MINUTES),
      0,
      0
  );

  return {
    start,
    end,
  };
};

export const getDateAtShortFormat = (date) => {
  return moment(date).format(`MMM DD`);
};

export const getTripDateInterval = (points) => {
  if (!points.length) {
    return ``;
  }

  const start = points[0].timeStart;
  const end = points[points.length - 1].timeStart;

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
