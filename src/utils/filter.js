import {FilterType} from "../data.js";
import moment from "moment";

export const filter = {
  [FilterType.FUTURE]: (points) => points.filter((point) => {
    return moment(point.timeStart).isAfter(new Date(), `day`);
  }),
  [FilterType.PAST]: (points) => points.filter((point) => {
    return moment(point.timeStart).isBefore(new Date(), `day`);
  })
};