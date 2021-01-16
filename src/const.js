export const PointCategory = {
  TRANSFER: `Transfer`,
  ACTIVITY: `Activity`
};

export const POINT_TYPES = new Map([
  [PointCategory.TRANSFER, [
    `Taxi`,
    `Bus`,
    `Train`,
    `Ship`,
    `Transport`,
    `Drive`,
    `Flight`
  ]],
  [PointCategory.ACTIVITY, [
    `Check-in`,
    `Sightseeing`,
    `Restaurant`
  ]]
]);

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const SortType = {
  DEFAULT: `Event`,
  TIME: `Time`,
  PRICE: `Price`
};

export const EventType = {
  FILTER: `Filter was changed`,
  SORT: `Sort type was changed`,
  POINT: `Point data was changed`,
  FAVORITE: `Property "Favorite" was changed`,
  ADD: `New point was added`,
  DELETE: `Point was deleted`,
  INIT: `Application init`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MAJOR: `MAJOR`
};

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`,
  NEW_POINT: `New Point`
};

export const TypeEmoji = new Map([
  [`Taxi`, `🚕`],
  [`Bus`, `🚌`],
  [`Train`, `🚂`],
  [`Ship`, `🚢`],
  [`Transport`, `🚆`],
  [`Drive`, `🚗`],
  [`Flight`, `✈️`],
  [`Check-in`, `🏨`],
  [`Sightseeing`, `🏛`],
  [`Restaurant`, `🍴`]
]);

export const ChartType = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME_SPENT: `TIME SPENT`,
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

export const PROTOCOL = {
  HTTP: `http`,
  HTTPS: `https`,
};
