import zodiacDescriptions from "../../res/descriptions/zodiac.json" with { type: "json" };
import { addSettingToPanel } from "./interface/panel.js";
import { settings } from "./settings.js";
import { addWidget } from "./widgets.js";

/**
 * For each month (0-indexed): the sign that begins in it and the day it starts.
 */
export const ZODIAC_SIGN_START_DAY = [
  ["aquarius", 20], // January
  ["pisces", 19], // February
  ["aries", 21], // March
  ["taurus", 20], // April
  ["gemini", 23], // May
  ["cancer", 22], // June
  ["leo", 23], // July
  ["virgo", 24], // August
  ["libra", 23], // September
  ["scorpio", 23], // October
  ["sagittarius", 22], // November
  ["capricorn", 22], // December
] as const satisfies readonly (readonly [string, number])[];

export type ZodiacSign = (typeof ZODIAC_SIGN_START_DAY)[number][0];

/**
 * @param day
 * @param month - starts at 0
 */
export function getZodiacSign(day: number, month: number): ZodiacSign {
  const entry = ZODIAC_SIGN_START_DAY[month];
  const previousEntry = ZODIAC_SIGN_START_DAY[(month + 11) % 12];
  if (!entry || !previousEntry) {
    throw new RangeError(`month must be between 0 and 11, got ${month}`);
  }

  const [sign, startDay] = entry;
  return day >= startDay ? sign : previousEntry[0];
}

export function initZodiac(widgetsContainer: HTMLDivElement): void {
  const date = new Date();
  const currentSign = getZodiacSign(date.getUTCDate(), date.getUTCMonth());
  const [baseDescription = "", mechanicalDescription = ""] =
    zodiacDescriptions[currentSign];

  const widget = addWidget(
    widgetsContainer,
    "zodiac",
    FILE_PREFIX + "res/img/zodiac/" + currentSign + ".png",
    baseDescription,
  );

  const image = widget.querySelector(
    ".nerthus__widget-image",
  ) as HTMLImageElement;
  const description = widget.querySelector(
    ".nerthus__widget-desc",
  ) as HTMLDivElement;

  image.style.cursor = "pointer";
  image.addEventListener("click", function () {
    if (description.textContent === baseDescription) {
      description.textContent = mechanicalDescription;
    } else {
      description.textContent = baseDescription;
    }
  });

  if (settings.zodiac) {
    widget.style.display = "flex";
  } else {
    widget.style.display = "none";
  }

  addSettingToPanel(
    "zodiac",
    "Widget znaku zodiaku",
    "Pokazuje lub ukrywa widget w lewym górnym rogu mapy.",
    function () {
      if (settings.zodiac) {
        widget.style.display = "flex";
      } else {
        widget.style.display = "none";
      }
    },
  );
}
