import {FilterType} from "../const.js";
import moment from "moment";

export const filter = {
  [FilterType.FUTURE]: (points) => points.filter((point) => {
    return moment(point.timeStart).isAfter(moment(), `day`);
  }),
  [FilterType.PAST]: (points) => points.filter((point) => {
    return moment(point.timeStart).isBefore(moment(), `day`);
  }),
  [FilterType.EVERYTHING]: (points) => points.slice()
};
