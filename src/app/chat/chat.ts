import { hasNarrationRights } from "../permissions.js";
import { sanitizeText } from "../utility-functions.js";
import { initChatDrunkenness } from "./drunkenness.js";

const commandsMap: Record<string, (chatMessageData: ChatMessageData) => void> =
  {};
const commandsPublicMap: Record<
  string,
  (chatMessageData: ChatMessageData) => void
> = {};

const COMMAND_REGEX = /^\*(\S+)/;
const URL_REGEX = /(https?)\*Krzywi się\.\*(\S+)/;

function fixUrl(text: string): string {
  return text.replace(URL_REGEX, "$1:/$2");
}

function fetchCmd(chatMessageData: ChatMessageData): string | undefined {
  const command = COMMAND_REGEX.exec(chatMessageData.text);
  if (command) {
    return command[1];
  }
  return;
}

function fetchCallback(
  command: string,
  msg: ChatMessageData,
): ((chatMessageData: ChatMessageData) => void) | undefined {
  if (
    commandsMap[command] &&
    hasNarrationRights(msg.authorBusinessCard.getAcc())
  ) {
    return commandsMap[command];
  }
  return commandsPublicMap[command];
}

function parseMessage(chatMessageData: ChatMessageData): void {
  // change the message by editing the object passed as reference directly
  const command = fetchCmd(chatMessageData);
  if (!command) {
    return;
  }
  const callback = fetchCallback(command, chatMessageData);
  if (!callback) {
    return;
  }
  chatMessageData.text = fixUrl(chatMessageData.text);
  let nick = chatMessageData.authorBusinessCard.getNick();
  if (chatMessageData.receiverBusinessCard) {
    nick += " -> " + chatMessageData.receiverBusinessCard.getNick();
  }
  // [which tab] (author -> receiver): command
  log(
    sanitizeText(
      `[${chatMessageData.channel}] (${nick}): ${chatMessageData.text}`,
    ),
  );

  callback(chatMessageData);
}

function initParseNerthusCommandsProxy(): void {
  if (INTERFACE === "NI") {
    const oldAddMessage = Engine.chatController.addMessage;
    Engine.chatController.addMessage = function (...args) {
      parseMessage(args[0]);
      return oldAddMessage.apply(Engine.chatController, args);
    };
  } else {
    const oldAddMessage = g.chatController.addMessage;
    g.chatController.addMessage = function (...args) {
      parseMessage(args[0]);
      return oldAddMessage.apply(g.chatController, args);
    };
  }
}

export function initChatMgr(): void {
  initParseNerthusCommandsProxy();
  initChatDrunkenness();
}

export function registerChatCommand(
  name: string,
  func: (chatMessageData: ChatMessageData) => void,
  isPublic: boolean,
): void {
  if (isPublic) {
    commandsPublicMap[name] = func;
  } else {
    commandsMap[name] = func;
  }
}
