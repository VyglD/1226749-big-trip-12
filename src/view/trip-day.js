import {getDateAtShortFormat} from "../util.js";
import {getSystemFormattedDate} from "../date-util";

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
