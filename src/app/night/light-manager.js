import {
  addCustomStyle,
  removeCustomStyle,
  toggleCustomStyle,
} from "../interface/css-manager";
import { addDraggable } from "../utility-functions";
import { addSingleLight, lightsOn, resetLights, turnLightsOn } from "./lights";
import { applyCurrentNight } from "./night";

const lightManagerHtml = `
<div id="nerthus-light-manager-wrapper">
    <div id="nerthus-light-manager" class="nerthus-panel">
        <div class="header-label-positioner">
            <div class="header-label">
                <div class="left-decor"></div>
                <div class="right-decor"></div>
                <span class="panel-name">Narzędzia światła</span>
            </div>
        </div>
        <div class="close-decor">
            <button class="close-button" tip="Zamknij"></button>
        </div>
        <div class="background">
            <a id="nerthus-light-manager-toggle-lights" class="button" tip="Pokaż (lub ukryj) światła">
                <img src="${FILE_PREFIX}res/img/panel/sun.png">
            </a>
            <a id="nerthus-light-manager-toggle-mousemove" class="button" tip="Zablokuj chodzenie myszką">
                <img src="${FILE_PREFIX}res/img/panel/mouse.png">
            </a>
            <a id="nerthus-light-manager-delete-all" class="button" tip="Usuń wszystkie światła z mapy">
                <img src="${FILE_PREFIX}res/img/panel/trash.png">
            </a>
            <a id="nerthus-light-manager-toggle-border" class="button" tip="Przełącz obramowanie świateł">
                <img src="${FILE_PREFIX}res/img/panel/border.png">
            </a>
            <a id="nerthus-light-manager-save" class="button" tip="Pobierz dane o światłach">
                <img src="${FILE_PREFIX}res/img/panel/download.png">
            </a>
        </div>
    </div>
    <div class="subpanel nerthus-panel">
        <div class="background">
            <a id="nerthus-light-manager-add-s" class="button" tip="Dodaj małe światło">
                S
            </a>
            <a id="nerthus-light-manager-add-m" class="button" tip="Dodaj średnie światło">
                M
            </a>
            <a id="nerthus-light-manager-add-l" class="button" tip="Dodaj duże światło">
                L
            </a>
            <a id="nerthus-light-manager-add-xl" class="button" tip="Dodaj bardzo duże światło">
                XL
            </a>    
        </div> 
    </div>
</div>
`;

function removeTargetLight(e) {
  if (e.target.classList.contains("nerthus__night-light")) {
    $(e.target).remove();
  }
}

function startEditingLights() {
  addCustomStyle(
    "light-pointer-events",
    ".nerthus__night-light {pointer-events: all !important}",
  );

  $("#ground").on("dblclick", removeTargetLight);
  $(".nerthus__night-light").draggable();
}

function stopEditingLights() {
  removeCustomStyle("light-hider");
  removeCustomStyle("light-border");
  removeCustomStyle("light-pointer-events");
  applyCurrentNight();

  $("#ground").off("dblclick", removeTargetLight);
  $(".nerthus__night-light").draggable("disable");
}

function toggleLights() {
  if (lightsOn) {
    toggleCustomStyle(
      "light-hider",
      "#ground > .nerthus__night-light {display: none !important}",
    );
    $("#nerthus-light-manager-toggle-lights").toggleClass("blue");
  } else {
    turnLightsOn();
    $("#nerthus-light-manager-toggle-lights").addClass("blue");
  }
}

function toggleMouseMove() {
  const mouseHeroWalkOn = g.settingsOptions.isMouseHeroWalkOn();
  g.settingsStorage.sendRequest(7, null, !mouseHeroWalkOn);
  $("#nerthus-light-manager-toggle-mousemove").toggleClass("blue");
}

function toggleBorder() {
  toggleCustomStyle(
    "light-border",
    "#ground > .nerthus__night-light {border: 1px solid yellow}",
  );
  $("#nerthus-light-manager-toggle-border").toggleClass("blue");
}

function addLight(lightType) {
  if (INTERFACE === "SI") {
    const $light = addSingleLight(lightType, hero.x * 32, hero.y * 32);
    $light.draggable();
  }
}

function deleteAllLights() {
  resetLights();
  $(
    "#nerthus-light-manager-wrapper #nerthus-light-manager-toggle-lights",
  ).removeClass("blue");
}

function downloadLog() {
  const arr = [];
  $(".nerthus__night-light").each(function () {
    const $this = $(this);
    const pos = $this.position();
    const obj = {
      x: parseInt(pos.left),
      y: parseInt(pos.top),
      type: $this.attr("type"),
    };
    arr.push(obj);
  });

  // Properly format lights data
  const json =
    JSON.stringify(arr, null, 2)
      .replaceAll(/\{\n {4}/g, "{")
      .replaceAll(/\n {2}}/g, "}")
      .replaceAll(/,\n {3}/g, ",") + "\n";

  const a = window.document.createElement("a");
  a.href = window.URL.createObjectURL(
    new window.Blob([json], { type: "text/json" }),
  );
  if (INTERFACE === "NI") {
    a.download = "" + Engine.map.d.id + ".json";
  } else {
    a.download = "" + map.id + ".json";
  }
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function initLightManager() {
  if (INTERFACE === "NI") {
    return;
  }

  startEditingLights();
  const $lightManager = $(lightManagerHtml);

  const $toggleLights = $lightManager.find(
    "#nerthus-light-manager-toggle-lights",
  );
  $toggleLights.on("click", toggleLights);
  if (lightsOn) {
    $toggleLights.addClass("blue");
  }

  const $toggleMouseMove = $lightManager.find(
    "#nerthus-light-manager-toggle-mousemove",
  );
  $toggleMouseMove.on("click", toggleMouseMove);
  if (g.settingsOptions.isMouseHeroWalkOn()) {
    $toggleMouseMove.addClass("blue");
  }

  $lightManager
    .find("#nerthus-light-manager-delete-all")
    .on("click", deleteAllLights);

  addCustomStyle(
    "light-border",
    "#ground > .nerthus__night-light {border: 1px solid yellow}",
  );
  $lightManager
    .find("#nerthus-light-manager-toggle-border")
    .addClass("blue")
    .on("click", toggleBorder);

  $lightManager.find("#nerthus-light-manager-save").on("click", downloadLog);

  $lightManager
    .find("#nerthus-light-manager-add-s")
    .on("click", addLight.bind(null, "S"));
  $lightManager
    .find("#nerthus-light-manager-add-m")
    .on("click", addLight.bind(null, "M"));
  $lightManager
    .find("#nerthus-light-manager-add-l")
    .on("click", addLight.bind(null, "L"));
  $lightManager
    .find("#nerthus-light-manager-add-xl")
    .on("click", addLight.bind(null, "XL"));

  addDraggable($lightManager);
  $lightManager.appendTo("#centerbox2").css("position", "absolute");

  $lightManager.find(".close-button").on("click", function () {
    $lightManager.remove();
    stopEditingLights();
  });
}
