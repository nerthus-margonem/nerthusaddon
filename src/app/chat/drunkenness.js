import { addSettingToPanel } from "../interface/panel";
import { settings } from "../settings";

let intoxicationLvl = 0;
let decayTimerID = null;

function decayTimerHandler() {
  intoxicationLvl--;
  localStorage.setItem("nerthus-intoxication-lvl", intoxicationLvl);

  if (intoxicationLvl < 1) {
    intoxicationLvl = 0;
    clearInterval(decayTimerID);
    decayTimerID = null;
  }
}

function shuffleArray(array, cc) {
  let przestanek = 0;
  if (typeof cc == "undefined") {
    cc = 0;
  }
  if ([".", ",", "?", "!"].lastIndexOf(array[array.length - 1]) > -1) {
    przestanek = 1;
  }
  for (let i = array.length - 1 - cc - przestanek; i > cc; i--) {
    let j = Math.floor(Math.random() * (i + 1 - cc) + cc);
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function shuffleMessage(msg) {
  if (intoxicationLvl === 0 || ["*/@"].indexOf(msg[0]) >= 0) {
    return msg;
  }

  let t = [];
  switch (Math.floor(intoxicationLvl / 10)) {
    case 10:
    case 9:
      msg = "/lm bełkota coś niezrozumiale.";
      break;
    case 8:
      msg = shuffleArray(msg.split(" ")).join(" ");
    // fallthrough
    case 7:
      t = msg.split(", ");
      for (const index in t) {
        t[index] = shuffleArray(t[index].split(" ")).join(" ");
      }
      msg = t.join(", ");
    // fallthrough
    case 6:
      t = msg.split(", ");
      for (const index in t) {
        t[index] = shuffleArray(t[index].split(" "), 1).join(" ");
      }
      msg = t.join(", ");
    // fallthrough
    case 5:
      t = msg.split(" ");
      for (const index in t) {
        if (t[index].length > 4) {
          t[index] = shuffleArray(t[index].split("")).join("");
        }
      }
      msg = t.join(" ");
    // fallthrough
    case 4:
      t = msg.split(" ");
      for (const index in t) {
        if (t[index].length > 5) {
          t[index] = shuffleArray(t[index].split("")).join("");
        }
      }
      msg = t.join(" ");
    // fallthrough
    case 3:
      t = msg.split(" ");
      for (const index in t) {
        if (t[index].length > 4) {
          t[index] = shuffleArray(t[index].split(""), 1).join("");
        }
      }
      msg = t.join(" ");
    // fallthrough
    case 2:
      t = msg.split(" ");
      for (const index in t) {
        if (t[index].length > 5) {
          t[index] = shuffleArray(t[index].split(""), 1).join("");
        }
      }
      msg = t.join(" ");
    // fallthrough
    case 1:
      msg = msg.replace(/[.,:?!-]/g, " *hik*");
      break;
    case 0:
      msg = msg.replace(/[.,:?!-]/g, "");
  }
  return msg;
}

function commandContainsDrinkingAlcohol(command) {
  const match = command.match(/^moveitem.*id=(\d+)/);
  // st=1 means that it is eaten and not dropped or destroyed.
  if (!match || !command.includes("&st=1")) {
    return false;
  }

  let item;
  if (INTERFACE === "NI") {
    item = Engine.items.getItemById(match[1]);
  } else {
    item = g.item[match[1]];
  }

  if (
    item &&
    item.cl === 16 && // cl = 16 means it's consumable
    item.stat.search("lvl=") > -1 &&
    parseInt(item.stat.match(/lvl=(\d+)/)[1]) === 18
  ) {
    return true;
  }
}

function commandContainsNormalTalk(task, payload) {
  return (
    task.startsWith("chat&channel=local") &&
    !task.endsWith("&style=me") &&
    payload?.c &&
    !payload.c.startsWith("*")
  );
}

export function initChatDrunkenness() {
  addSettingToPanel(
    "drunkenness",
    "Upojenie alkoholowe",
    "Po wypiciu napojów alkoholowych postać zaczyna coraz bardziej bełkotać.",
    () => {},
  );

  const savedIntoxicationLvl = localStorage.getItem("nerthus-intoxication-lvl");
  if (savedIntoxicationLvl) {
    intoxicationLvl = parseInt(savedIntoxicationLvl);
  }
  if (intoxicationLvl) {
    decayTimerID = setInterval(decayTimerHandler, 10000);
  }

  const __g = _g;
  window._g = function (task, callback, payload) {
    if (!settings.drunkenness) {
      return __g(...arguments);
    }

    if (commandContainsDrinkingAlcohol(task)) {
      intoxicationLvl += 10;
      if (intoxicationLvl > 100) {
        intoxicationLvl = 100;
      }

      localStorage.setItem("nerthus-intoxication-lvl", intoxicationLvl);

      if (!decayTimerID) {
        decayTimerID = setInterval(decayTimerHandler, 10000);
      }
    }
    if (commandContainsNormalTalk(task, payload)) {
      payload.c = shuffleMessage(payload.c);
      if (payload.c.startsWith("/lm ")) {
        arguments[0] += "&style=me";
        payload.c = payload.c.substring(4);
      }
    }

    return __g(...arguments);
  };
}

/**
 * Original version license:
 * ==================================================================
 * OBSŁUGA PICIA - Autor Godfryd
 * ==================================================================
 */
