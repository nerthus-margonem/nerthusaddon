import { addCustomStyle, removeCustomStyle } from "../interface/css-manager";
import { addSettingToPanel } from "../interface/panel";
import { saveSetting, settings } from "../settings";

const HIDE_CHAT_COMMERCIALS_STYLE_NAME = "hide-chat-commercials";
const HIDE_CHAT_COMMERCIALS_CSS = ".chat-COMMERCIAL-message { display: none; }";

export function initHideChatCommercials() {
  if (settings.hideChatCommercials) {
    addCustomStyle(HIDE_CHAT_COMMERCIALS_STYLE_NAME, HIDE_CHAT_COMMERCIALS_CSS);
  }

  addSettingToPanel(
    "hideChatCommercials",
    "Ukrywanie reklam",
    "Pokazuje lub ukrywa reklamy pojawiające się na czacie gry.",
    () => {
      saveSetting(settings.hideChatCommercials, !settings.hideChatCommercials);
      if (settings.hideChatCommercials) {
        addCustomStyle(
          HIDE_CHAT_COMMERCIALS_STYLE_NAME,
          HIDE_CHAT_COMMERCIALS_CSS,
        );
      } else {
        removeCustomStyle(HIDE_CHAT_COMMERCIALS_STYLE_NAME);
      }
    },
  );
}
