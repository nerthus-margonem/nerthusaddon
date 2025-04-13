function validateTime(npc) {
  if (!npc.time) return true;

  const start = parseTimeStrToDate(npc.time.split("-")[0]);
  const end = parseTimeStrToDate(npc.time.split("-")[1]);
  const now = new Date();
  if (start > end) return start <= now || now <= end;
  return start <= now && now <= end;
}

function parseTimeStrToDate(timeStr) {
  timeStr = timeStr.split(":");
  const date = new Date();
  date.setHours(timeStr[0], timeStr[1] || 0);
  return date;
}

function validateDays(npc) {
  if (!npc.days) return true;

  const day_of_week = new Date().getDay();
  return npc.days.indexOf(day_of_week) > -1;
}

function parseStrToDate(date_str) {
  //DD.MM.YYYY
  date_str = date_str.split(".");
  const date = new Date();
  const day = date_str[0] || date.getDay();
  const month = date_str[1] ? parseInt(date_str[1]) - 1 : date.getMonth(); //month 0-11
  const year = date_str[2] || date.getFullYear();
  date.setFullYear(year, month, day);
  return date;
}

function validateDate(npc) {
  if (!npc.date) return true;

  const begin = parseStrToDate(npc.date.split("-")[0]);
  const now = new Date();
  const end = parseStrToDate(npc.date.split("-")[1]);

  if (begin > end) {
    return begin <= now || now <= end;
  } else {
    return begin <= now && now <= end;
  }
}

export function isNpcDeployable(npc) {
  return validateTime(npc) && validateDays(npc) && validateDate(npc);
}
