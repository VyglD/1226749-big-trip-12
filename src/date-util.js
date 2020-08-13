import {getRandomInteger} from "./util";

const REGEX_SYSTEM_DATE = /(\d{2}).(\d{2}).(\d{4})/;
const END_OF_SINGLE_DIGITS = 10;
const DAY_SHIFT = 1;
const MAX_MINUTES = 59;
const MAX_HOURS = 23;
const MIN_HOURS = 1;

const humanizeTimeFormat = (value, letter, ...conditions) => {
  conditions.push(value);
  return conditions.some(Boolean)
    ? `${(value < END_OF_SINGLE_DIGITS) ? `0` : ``}${value}${letter}`
    : ``;
};

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
  return date.toLocaleString(`en-US`, {month: `short`, day: `2-digit`});
};

export const getTripDateInterval = (tripEvents) => {
  const start = getDateAtShortFormat(tripEvents[0].timeStart).split(` `);
  const end = getDateAtShortFormat(tripEvents[tripEvents.length - 1].timeStart).split(` `);

  if (start[0] === end[0]) {
    end[0] = ``;
  }

  return `${start[0]} ${start[1]}&nbsp;&mdash;&nbsp;${end[1]} ${end[0]}`;
};

export const getSystemFormattedDate = (date) => {
  const dateArgs = REGEX_SYSTEM_DATE.exec(new Date(date).toLocaleString(
      `en-US`,
      {year: `numeric`, month: `2-digit`, day: `2-digit`}
  ));

  return `${dateArgs[3]}-${dateArgs[2]}-${dateArgs[1]}`;
};

export const getHumanizeTime = (time) => {
  return time.toLocaleTimeString(
      `en-US`,
      {hour12: false, hour: `numeric`, minute: `numeric`}
  );
};

export const getHumanizeTimeInterval = (interval) => {
  const excessDays = new Date(0).getDate();
  const excessHours = new Date(0).getTimezoneOffset() / 60;
  const diff = new Date(interval);
  const days = humanizeTimeFormat((diff.getDate() - excessDays), `D`);
  const hours = humanizeTimeFormat((diff.getHours() + excessHours), `H`, days);
  const minutes = humanizeTimeFormat((diff.getMinutes()), `M`, days, hours);

  return `${days} ${hours} ${minutes}`;
};

export const getFormattedTimeString = (time) => {
  return time.toLocaleString(
      `en-US`,
      {
        year: `2-digit`,
        month: `2-digit`,
        day: `2-digit`,
        hour: `2-digit`,
        minute: `2-digit`,
        hour12: false
      }
  ).replace(`,`, ``);
};
