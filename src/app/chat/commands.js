import {
  addToMapChangelist,
  applyCurrentMapChange,
  removeFromMapChangelist,
} from "../maps";
import { applyCurrentNight, setForcedParameters } from "../night/night";
import { Npc } from "../npc/npc";
import { addNpcToList } from "../npc/npc-actions/add";
import { hideGameNpc } from "../npc/npc-actions/hide";
import { removeNpc } from "../npc/npc-actions/remove";
import { settings } from "../settings";
import { sanitizeText } from "../utility-functions";
import { clearEffects } from "../weather/effects";
import { displayWeather, setForcedWeather } from "../weather/weather";
import { registerChatCommand } from "./chat";

const BLOCKED_CHANNELS = ["TRADE", "GLOBAL"];

function getAuthorBusinessCardProxy(businessCard, newAuthorNick) {
  return new Proxy(businessCard, {
    get(target, prop) {
      if (prop === "getNick") return () => newAuthorNick;
      return Reflect.get(...arguments);
    },
  });
}

function hideMessageIdentity(msg) {
  msg.authorBusinessCard = new Proxy(
    {},
    {
      get: () => () => "",
    },
  );
  if (msg.receiverBusinessCard) {
    msg.receiverBusinessCard = new Proxy(
      {},
      {
        get: () => () => "",
      },
    );
  }
}

function nar0(msg) {
  msg.style = "nerthus-nar0";
  msg.nick = msg.authorBusinessCard.getNick();
  hideMessageIdentity(msg);
  msg.text = msg.text.replace(/^\*nar0? /, "");
  return msg;
}

function nar1(msg) {
  msg.style = "nerthus-nar1";
  msg.nick = msg.authorBusinessCard.getNick();
  hideMessageIdentity(msg);
  msg.text = msg.text.replace(/^\*nar1? /, "");
  return msg;
}

function nar2(msg) {
  msg.style = "nerthus-nar2";
  msg.nick = msg.authorBusinessCard.getNick();
  hideMessageIdentity(msg);
  msg.text = msg.text.replace(/^\*nar2 /, "");
  return msg;
}

function nar3(msg) {
  msg.style = "nerthus-nar3";
  msg.nick = msg.authorBusinessCard.getNick();
  hideMessageIdentity(msg);
  msg.text = msg.text.replace(/^\*nar3 /, "");
  return msg;
}

function nar6(msg) {
  msg.style = "nerthus-nar-rainbow";
  msg.nick = msg.authorBusinessCard.getNick();
  hideMessageIdentity(msg);
  msg.text = msg.text.replace(/^\*nar6 /, "");
  return msg;
}

function dial0(msg) {
  msg.style = "nerthus-dial0";
  msg.nick = msg.authorBusinessCard.getNick();
  const [author, ...messageParts] = msg.text
    .split(" ")
    .slice(1)
    .join(" ")
    .split(",");
  msg.authorBusinessCard = getAuthorBusinessCardProxy(
    msg.authorBusinessCard,
    author,
  );
  msg.text = messageParts.join(",");
  return msg;
}

function dial1(msg) {
  msg.style = "nerthus-dial1";
  msg.nick = msg.authorBusinessCard.getNick();
  const [author, ...messageParts] = msg.text
    .split(" ")
    .slice(1)
    .join(" ")
    .split(",");
  msg.authorBusinessCard = getAuthorBusinessCardProxy(
    msg.authorBusinessCard,
    author,
  );
  msg.text = messageParts.join(",");
  return msg;
}

function dial2(msg) {
  msg.style = "nerthus-dial2";
  msg.nick = msg.authorBusinessCard.getNick();
  const [author, ...messageParts] = msg.text
    .split(" ")
    .slice(1)
    .join(" ")
    .split(",");
  msg.authorBusinessCard = getAuthorBusinessCardProxy(
    msg.authorBusinessCard,
    author,
  );
  msg.text = messageParts.join(",");
  return msg;
}

function dial3(msg) {
  msg.style = "nerthus-dial3";
  msg.nick = msg.authorBusinessCard.getNick();
  const [author, ...messageParts] = msg.text
    .split(" ")
    .slice(1)
    .join(" ")
    .split(",");
  msg.authorBusinessCard = getAuthorBusinessCardProxy(
    msg.authorBusinessCard,
    author,
  );
  msg.text = messageParts.join(",");
  return msg;
}

function dial666(msg) {
  msg.style = "nerthus-dial666";
  msg.nick = msg.authorBusinessCard.getNick();
  const [author, ...messageParts] = msg.text
    .split(" ")
    .slice(1)
    .join(" ")
    .split(",");
  msg.authorBusinessCard = getAuthorBusinessCardProxy(
    msg.authorBusinessCard,
    author,
  );
  msg.text = messageParts.join(",");
  return msg;
}

function sys(msg) {
  msg.style = "nerthus-sys";
  msg.nick = msg.authorBusinessCard.getNick();
  hideMessageIdentity(msg);
  msg.text = msg.text.replace(/^\*sys /, "");
  return msg;
}

function map(msg) {
  msg.style = "nerthus-command";
  const cmd = msg.text.split(" ").slice(1).join(" ").split(",");
  const mapUrl = sanitizeText(cmd[0]);
  const mapId = parseInt(cmd[1]);
  if (mapId) {
    addToMapChangelist(mapUrl, 2, mapId);
  } else if (BLOCKED_CHANNELS.includes(msg.channel)) {
    // Do not change everyone's map on global or trade
    return;
  } else {
    addToMapChangelist(mapUrl, 1);
  }
  applyCurrentMapChange();
}

function resetMap(msg) {
  msg.style = "nerthus-command";
  const mapId = parseInt(msg.text.split(" ").slice(1).join(" "));

  removeFromMapChangelist(2, mapId);
  applyCurrentMapChange();

  return false;
}

function light(msg) {
  msg.style = "nerthus-command";
  const arr = msg.text.split(" ");
  arr.shift();
  const argArr = arr.join(" ").split(",");
  if (
    BLOCKED_CHANNELS.includes(msg.channel) &&
    (arr.length === 0 || !argArr[2])
  ) {
    // Do not change everyone's light on global or trade
    return;
  }

  if (arr.length === 0)
    setForcedParameters(-1, "#000"); // if no arguments
  else {
    let opacity = argArr[0].trim();
    const color = argArr[1] ? argArr[1].trim() : "#000";
    const mapId = argArr[2] ? argArr[2].trim() : "default";
    opacity = parseFloat(opacity.replace(",", "."));
    setForcedParameters(1 - opacity, color, mapId);
  }

  applyCurrentNight();

  return false;
}

function addGraf(msg) {
  msg.style = "nerthus-command";
  //cmd[0]=x, cmd[1]=y, cmd[2]=url, cmd[3]=tip_text, cmd[4]=isCol, cmd[5]=map_id
  const cmd = msg.text.split(" ").slice(1).join(" ").split(",");
  const x = parseInt(cmd[0]);
  const y = parseInt(cmd[1]);
  const url = sanitizeText(cmd[2]);
  const name = sanitizeText(cmd[3]);
  let nick = name ?? "";
  if (INTERFACE === "SI") {
    nick = `<b>${nick}</b>`;
  }
  const isCol = parseInt(cmd[4]) > 0;
  const mapId = parseInt(cmd[5]);

  if (BLOCKED_CHANNELS.includes(msg.channel) && !mapId) {
    // Do not add graphic on global or trade
    return;
  }

  addNpcToList(new Npc(x, y, url, nick, isCol), mapId);
  return false;
}

function delGraf(msg) {
  msg.style = "nerthus-command";
  const cmd = msg.text.split(" ")[1].split(",");
  const x = parseInt(cmd[0]);
  const y = parseInt(cmd[1]);
  const mapId = parseInt(cmd[2]);

  if (BLOCKED_CHANNELS.includes(msg.channel) && !mapId) {
    // Do not add graphic on global or trade
    return;
  }

  removeNpc(x, y, mapId);
  return false;
}

function hide(msg) {
  msg.style = "nerthus-command";
  const cmd = msg.text.split(" ")[1];
  const id = parseInt(cmd);

  hideGameNpc(id);

  return false;
}

function weather(msg) {
  msg.style = "nerthus-command";
  const weatherArr = /^\*weather(?: ([\w-]+)(?:, ?(\d+))?)?/g.exec(msg.text);
  if (!weatherArr) return false;

  if (BLOCKED_CHANNELS.includes(msg.channel)) {
    // Do not change weather on global or trade
    return;
  }

  setForcedWeather(weatherArr[1], weatherArr[2]);
  if (settings.weatherEffects) clearEffects(true);
  displayWeather();

  return false;
}

function me(msg) {
  msg.style = 2; // 2 is special style for regular `/me`
  msg.nick = msg.authorBusinessCard.getNick();
  hideMessageIdentity(msg);
  msg.text = msg.text.replace(/^\*me /, "");
  return msg;
}

function lang(msg) {
  console.log(msg);
  if (msg.text.split(",").length < 2) return msg; // early return incorrect input

  msg.style = `nerthus-lang nerthus-lang-ts-${msg.ts}`;
  msg.text = msg.text.replace(/^\*lang /, ""); // remove *lang
  const cmd = msg.text.split(",");

  const notAllowed = /[^a-ząćęłńóśźż -]/gi;
  const tip = cmd[0].toLowerCase().replace(notAllowed, "");
  cmd.shift(); // remove tip

  msg.text = `*${cmd.join(",").trim()}*`;

  // for external addon usage
  msg.tip = tip;

  // add language tip after the message is added to the page
  setTimeout(function () {
    const elements = Array.from(
      document.querySelectorAll(`.nerthus-lang-ts-${msg.ts} .message-part`),
    );
    for (const element of elements) {
      $(element).tip(`Język wiadomości: ${tip}`);
    }
  }, 0);

  return msg;
}

const narratorCommands = {
  nar: nar1,
  nar1: nar1,
  nar2: nar2,
  nar3: nar3,
  nar6: nar6,
  dial: dial1,
  dial1: dial1,
  dial2: dial2,
  dial3: dial3,
  dial666: dial666,
  sys: sys,
  map: map,
  resetMap: resetMap,
  light: light,
  addGraf: addGraf,
  delGraf: delGraf,
  hide: hide,
  weather: weather,
};
const publicCommands = {
  me: me,
  lang: lang,
  nar0: nar0,
  dial0: dial0,
};

export function initBasicChatCommands() {
  for (const cmd in narratorCommands)
    registerChatCommand(cmd, narratorCommands[cmd], false);
  for (const cmd in publicCommands)
    registerChatCommand(cmd, publicCommands[cmd], true);
}
