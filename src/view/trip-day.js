import {getDateAtShortFormat} from "../util.js";

const REGEX_SYSTEM_DATE = /(\d{2}).(\d{2}).(\d{4})/;

const getSystemFormattedDate = (date) => {
  const dateArgs = REGEX_SYSTEM_DATE.exec(new Date(date).toLocaleString(
      `en-US`,
      {year: `numeric`, month: `2-digit`, day: `2-digit`}
  ));

  return `${dateArgs[3]}-${dateArgs[2]}-${dateArgs[1]}`;
};

export const createTripDayTemplate = (date, index) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index}</span>
        <time class="day__date" datetime="${getSystemFormattedDate(date)}">
          ${getDateAtShortFormat(new Date(date))}
        </time>
      </div>

      <ul class="trip-events__list" id="trip-events__list-${index}">
      </ul>
    </li>`
  );
};
