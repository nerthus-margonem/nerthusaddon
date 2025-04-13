export const SEASON = Object.freeze({
  SPRING: "spring",
  SUMMER: "summer",
  AUTUMN: "autumn",
  WINTER: "winter",
});

//TODO implement this file in other places

export function getCurrentSeason() {
  function makeStartDate(day, month) {
    const date = new Date();
    date.setUTCDate(day);
    date.setUTCMonth(month - 1);
    return date;
  }

  const date = new Date();
  const SPRING_BEGIN = makeStartDate(21, 3);
  const SUMMER_BEGIN = makeStartDate(22, 6);
  const AUTUMN_BEGIN = makeStartDate(23, 9);
  const WINTER_BEGIN = makeStartDate(22, 11); //long winter

  if (date >= WINTER_BEGIN) {
    return SEASON.WINTER;
  }
  if (date >= AUTUMN_BEGIN) {
    return SEASON.AUTUMN;
  }
  if (date >= SUMMER_BEGIN) {
    return SEASON.SUMMER;
  }
  if (date >= SPRING_BEGIN) {
    return SEASON.SPRING;
  }
  return SEASON.WINTER;
}
