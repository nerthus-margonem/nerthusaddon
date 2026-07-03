export const SEASON = Object.freeze({
  SPRING: "spring",
  SUMMER: "summer",
  AUTUMN: "autumn",
  WINTER: "winter",
});

//TODO implement this file in other places

/**
 * @return {"spring"|"summer"|"autumn"|"winter"}
 */
export function getCurrentSeason() {
  const now = new Date();

  function makeStartDate(day, month) {
    const date = new Date(now);
    date.setUTCMonth(month - 1, day);
    return date;
  }

  const SPRING_BEGIN = makeStartDate(21, 3);
  const SUMMER_BEGIN = makeStartDate(22, 6);
  const AUTUMN_BEGIN = makeStartDate(23, 9);
  const WINTER_BEGIN = makeStartDate(22, 11); //long winter

  if (now >= WINTER_BEGIN) {
    return SEASON.WINTER;
  }
  if (now >= AUTUMN_BEGIN) {
    return SEASON.AUTUMN;
  }
  if (now >= SUMMER_BEGIN) {
    return SEASON.SUMMER;
  }
  if (now >= SPRING_BEGIN) {
    return SEASON.SPRING;
  }
  return SEASON.WINTER;
}
