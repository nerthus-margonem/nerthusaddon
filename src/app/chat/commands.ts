import { mapManager } from "../map-manager.js";
import { applyCurrentNight, setForcedParameters } from "../night/night.js";
import { addNpcToList } from "../npc/npc-actions/add.js";
import { hideGameNpc } from "../npc/npc-actions/hide.js";
import { removeNpc } from "../npc/npc-actions/remove.js";
import { Npc } from "../npc/npc.js";
import { settings } from "../settings.js";
import { sanitizeText, setTip } from "../utility-functions.js";
import { clearEffects } from "../weather/effects.js";
import { clearFog, createFog } from "../weather/fog.js";
import { displayWeather, setForcedWeather } from "../weather/weather.js";
import { registerChatCommand } from "./chat.js";
import { getRollHtml, getRollText, rollDice } from "./dice.js";

const BLOCKED_CHANNELS = new Set(["TRADE", "GLOBAL"]);

function getAuthorBusinessCardProxy(
  businessCard: BusinessCard,
  newAuthorNick: string,
) {
  return new Proxy(businessCard, {
    get(target, prop, receiver) {
      if (prop === "getNick") {
        return () => newAuthorNick;
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}

function hideMessageIdentity(msg: ChatMessageData): void {
  const emptyProxy = new Proxy({} as BusinessCard, {
    get: () => () => "",
  });

  msg.authorBusinessCard = emptyProxy;
  if (msg.receiverBusinessCard) {
    msg.receiverBusinessCard = emptyProxy;
  }
}

function splitDialogueCommand(
  command: string,
): { author: string; message: string } | undefined {
  const split = command.split(",");
  const author = split[0];
  if (!author) {
    return;
  }
  const message = split.slice(1).join(",");

  return {
    author,
    message,
  };
}

function getCommandBody(msg: ChatMessageData): string {
  return msg.text.split(" ").slice(1).join(" ");
}

function nar0(msg: ChatMessageData): void {
  msg.style = "nerthus-nar0";
  msg.nick = msg.authorBusinessCard.getNick();
  hideMessageIdentity(msg);
  msg.text = getCommandBody(msg);
}

function nar1(msg: ChatMessageData): void {
  msg.style = "nerthus-nar1";
  msg.nick = msg.authorBusinessCard.getNick();
  hideMessageIdentity(msg);
  msg.text = getCommandBody(msg);
}

function nar2(msg: ChatMessageData): void {
  msg.style = "nerthus-nar2";
  msg.nick = msg.authorBusinessCard.getNick();
  hideMessageIdentity(msg);
  msg.text = getCommandBody(msg);
}

function nar3(msg: ChatMessageData): void {
  msg.style = "nerthus-nar3";
  msg.nick = msg.authorBusinessCard.getNick();
  hideMessageIdentity(msg);
  msg.text = getCommandBody(msg);
}

function nar6(msg: ChatMessageData): void {
  msg.style = "nerthus-nar-rainbow";
  msg.nick = msg.authorBusinessCard.getNick();
  hideMessageIdentity(msg);
  msg.text = getCommandBody(msg);
}

function dial0(msg: ChatMessageData): void {
  const command = getCommandBody(msg);
  const split = splitDialogueCommand(command);
  if (!split) {
    return;
  }
  msg.style = "nerthus-dial0";
  msg.nick = msg.authorBusinessCard.getNick();
  msg.authorBusinessCard = getAuthorBusinessCardProxy(
    msg.authorBusinessCard,
    split.author,
  );
  msg.text = split.message;
}

function dial1(msg: ChatMessageData): void {
  const command = getCommandBody(msg);
  const split = splitDialogueCommand(command);
  if (!split) {
    return;
  }
  msg.style = "nerthus-dial1";
  msg.nick = msg.authorBusinessCard.getNick();
  msg.authorBusinessCard = getAuthorBusinessCardProxy(
    msg.authorBusinessCard,
    split.author,
  );
  msg.text = split.message;
}

function dial2(msg: ChatMessageData): void {
  const command = getCommandBody(msg);
  const split = splitDialogueCommand(command);
  if (!split) {
    return;
  }
  msg.style = "nerthus-dial2";
  msg.nick = msg.authorBusinessCard.getNick();
  msg.authorBusinessCard = getAuthorBusinessCardProxy(
    msg.authorBusinessCard,
    split.author,
  );
  msg.text = split.message;
}

function dial3(msg: ChatMessageData): void {
  const command = getCommandBody(msg);
  const split = splitDialogueCommand(command);
  if (!split) {
    return;
  }
  msg.style = "nerthus-dial3";
  msg.nick = msg.authorBusinessCard.getNick();
  msg.authorBusinessCard = getAuthorBusinessCardProxy(
    msg.authorBusinessCard,
    split.author,
  );
  msg.text = split.message;
}

function dial666(msg: ChatMessageData): void {
  const command = getCommandBody(msg);
  const split = splitDialogueCommand(command);
  if (!split) {
    return;
  }
  msg.style = "nerthus-dial666";
  msg.nick = msg.authorBusinessCard.getNick();
  msg.authorBusinessCard = getAuthorBusinessCardProxy(
    msg.authorBusinessCard,
    split.author,
  );
  msg.text = split.message;
}

function sys(msg: ChatMessageData): void {
  msg.style = "nerthus-sys";
  msg.nick = msg.authorBusinessCard.getNick();
  hideMessageIdentity(msg);
  msg.text = getCommandBody(msg);
}

function map(msg: ChatMessageData): void {
  msg.style = "nerthus-command";
  if (BLOCKED_CHANNELS.has(msg.channel)) {
    // Do not change everyone's map on global or trade
    return;
  }

  const cmd = getCommandBody(msg).split(",");
  const mapUrl = sanitizeText(cmd[0]);
  const mapId = cmd[1] ? Number.parseInt(cmd[1]) : undefined;
  if (mapId) {
    mapManager.addToMapChangelist(mapUrl, 2, mapId);
  } else {
    mapManager.addToMapChangelist(mapUrl, 1);
  }
  mapManager.applyCurrentMapChange();
}

function resetMap(msg: ChatMessageData): void {
  msg.style = "nerthus-command";
  const mapId = Number.parseInt(getCommandBody(msg));
  if (Number.isNaN(mapId)) {
    return;
  }

  mapManager.removeFromMapChangelist(mapId, 2);
  mapManager.applyCurrentMapChange();
}

function light(msg: ChatMessageData): void {
  msg.style = "nerthus-command";
  const cmd = getCommandBody(msg).split(",");
  if (BLOCKED_CHANNELS.has(msg.channel) && !cmd[2]) {
    // Do not change everyone's light on global or trade
    return;
  }

  if (cmd.length === 0 || cmd[0] === undefined) {
    setForcedParameters(-1, "#000");
  } else {
    const opacity = Number.parseFloat(cmd[0].trim());
    const color = cmd[1] ? cmd[1].trim() : "#000";
    let mapId = cmd[2] ? Number.parseInt(cmd[2].trim()) : undefined;
    if (Number.isNaN(mapId)) {
      mapId = undefined;
    }
    setForcedParameters(1 - opacity, color, mapId ?? "default");
  }

  applyCurrentNight();
}

function addGraf(msg: ChatMessageData): void {
  msg.style = "nerthus-command";

  // cmd[0]=x, cmd[1]=y, cmd[2]=url, cmd[3]=tip_text, cmd[4]=isCol, cmd[5]=map_id
  const cmd = getCommandBody(msg).split(",");
  if (!cmd[0] || !cmd[1] || !cmd[2]) {
    return;
  }
  const x = Number.parseInt(cmd[0]);
  const y = Number.parseInt(cmd[1]);
  const url = sanitizeText(cmd[2]);
  const name = sanitizeText(cmd[3]);
  let nick = name ?? "";
  if (INTERFACE === "SI") {
    nick = `<b>${nick}</b>`;
  }
  const isCol = cmd[4] ? Number.parseInt(cmd[4]) > 0 : false;
  let mapId: number | undefined = cmd[5] ? Number.parseInt(cmd[5]) : undefined;
  if (Number.isNaN(mapId)) {
    mapId = undefined;
  }

  if (BLOCKED_CHANNELS.has(msg.channel) && !mapId) {
    // Do not add graphic on global or trade
    return;
  }

  addNpcToList(new Npc(x, y, url, nick, isCol), mapId ?? "default");
}

function delGraf(msg: ChatMessageData): void {
  msg.style = "nerthus-command";
  const cmd = getCommandBody(msg).split(",");
  if (!cmd[0] || !cmd[1]) {
    return;
  }

  const x = Number.parseInt(cmd[0]);
  const y = Number.parseInt(cmd[1]);
  const mapId = cmd[2] ? Number.parseInt(cmd[2]) : undefined;
  if (BLOCKED_CHANNELS.has(msg.channel) && !mapId) {
    // Do not add global graphic on global or trade
    return;
  }

  removeNpc(x, y, mapId);
}

function hide(msg: ChatMessageData): void {
  msg.style = "nerthus-command";
  const cmd = getCommandBody(msg);
  if (cmd) {
    const id = Number.parseInt(cmd);
    hideGameNpc(id);
  }
}

function weather(msg: ChatMessageData): void {
  msg.style = "nerthus-command";
  if (BLOCKED_CHANNELS.has(msg.channel)) {
    // Do not change weather on global or trade
    return;
  }

  const weatherArr = /^\*weather(?: ([\w-]+)(?:, ?(\d+))?)?/g.exec(msg.text);
  if (!weatherArr) {
    return;
  }

  setForcedWeather(weatherArr[1], weatherArr[2]);
  if (settings.weatherEffects) {
    clearEffects(true);
  }
  displayWeather();
}

function fog(msg: ChatMessageData): void {
  msg.style = "nerthus-command";

  const cmd = getCommandBody(msg).split(",");
  const red = cmd[0] ? Number.parseInt(cmd[0]) : 255;
  const green = cmd[1] ? Number.parseInt(cmd[1]) : 255;
  const blue = cmd[2] ? Number.parseInt(cmd[2]) : 255;
  const alpha = cmd[3] ? Number.parseFloat(cmd[3]) : 0.4;
  const mapId = cmd[4] ? Number.parseInt(cmd[4]) : undefined;

  createFog({ r: red, g: green, b: blue, a: alpha }, mapId);
}

function clearFogCommand(msg: ChatMessageData): void {
  msg.style = "nerthus-command";

  const cmd = getCommandBody(msg).split(",");
  const mapId = cmd[0] ? Number.parseInt(cmd[0]) : undefined;
  if (Number.isNaN(mapId)) {
    return;
  }

  clearFog(mapId);
}

function me(msg: ChatMessageData): void {
  msg.style = "2"; // 2 is special style for regular `/me`
  msg.nick = msg.authorBusinessCard.getNick();
  hideMessageIdentity(msg);
  msg.text = getCommandBody(msg);
}

function lang(msg: ChatMessageData): void {
  const cmd = getCommandBody(msg).split(",");
  if (!cmd[0] || !cmd[1]) {
    // early return incorrect input
    return;
  }

  msg.style = `nerthus-lang nerthus-lang-ts-${msg.ts}`;

  const notAllowed = /[^a-ząćęłńóśźż -]/gi;
  const tip = cmd[0].toLowerCase().replaceAll(notAllowed, "");

  msg.text = `*${cmd.slice(1).join(",").trim()}*`;

  // for external addon usage
  msg.tip = tip;

  // add language tip after the message is added to the page
  setTimeout(function () {
    const elements = Array.from(
      document.querySelectorAll(`.nerthus-lang-ts-${msg.ts} .message-part`),
    );
    for (const element of elements) {
      setTip(element, `Język wiadomości: ${tip}`);
    }
  }, 0);
}

function dice(msg: ChatMessageData): void {
  msg.style = `nerthus-dice nerthus-dice-ts-${msg.ts}`;
  msg.nick = msg.authorBusinessCard.getNick();
  hideMessageIdentity(msg);

  let amount = 1;
  const amountMatch = msg.text.match(/\^*.+? (\d+)(?:d|$)/);
  if (amountMatch?.[1]) {
    amount = Math.min(Math.max(Number(amountMatch[1]), 1), 20);
  }

  let diceSides = 6;
  const diceSidesMatch = msg.text.match(/\^*.+? \d*d(\d+)/);
  if (diceSidesMatch?.[1]) {
    diceSides = Math.min(Math.max(Number(diceSidesMatch[1]), 2), 10000);
  }

  const rolls = rollDice(amount, diceSides, msg.ts);
  const rollText = getRollText(rolls);
  const rollHtml = getRollHtml(rolls, diceSides);

  if (amount === 1) {
    msg.text = `${msg.nick} rzucił kostką o ${diceSides} ściankach i wypadła liczba ${rollText}`;
  } else if (amount < 5) {
    msg.text = `${msg.nick} rzucił ${amount} kostki o ${diceSides} ściankach i wypadły liczby: ${rollText}`;
  } else {
    msg.text = `${msg.nick} rzucił ${amount} kostek o ${diceSides} ściankach i wypadły liczby: ${rollText}`;
  }

  // add highlights to low and high values
  setTimeout(function () {
    const elements = Array.from(
      document.querySelectorAll(`.nerthus-dice-ts-${msg.ts} .message-part`),
    );
    for (const element of elements) {
      element.innerHTML = element.innerHTML.replace(rollText, rollHtml);
    }
  }, 0);
}

const narratorCommands = {
  nar: nar1,
  nar1,
  nar2,
  nar3,
  nar6,
  dial: dial1,
  dial1,
  dial2,
  dial3,
  dial666,
  sys,
  map,
  resetMap,
  light,
  addGraf,
  delGraf,
  hide,
  weather,
  fog,
  clearFog: clearFogCommand,
};
const publicCommands = {
  me,
  lang,
  nar0,
  dial0,
  dice,
  roll: dice,
};

export function initBasicChatCommands() {
  for (const [cmd, callback] of Object.entries(narratorCommands)) {
    registerChatCommand(cmd, callback, false);
  }
  for (const [cmd, callback] of Object.entries(publicCommands)) {
    registerChatCommand(cmd, callback, true);
  }
}
