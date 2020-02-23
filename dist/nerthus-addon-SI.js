/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/chat/chat-basic-commands.js":
/*!*****************************************!*\
  !*** ./src/chat/chat-basic-commands.js ***!
  \*****************************************/
/*! exports provided: initBasicChatCommands */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initBasicChatCommands\", function() { return initBasicChatCommands; });\n/* harmony import */ var _chat_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chat-manager */ \"./src/chat/chat-manager.js\");\n\n\nfunction makeDialogTextWithSpeaker(str)\n{\n    str = str.split(\" \").slice(1).join(\" \").split(\",\")\n    return \"«\" + str[0] + \"» \" + str.slice(1).join(\",\")\n}\n\nfunction nar1(ch)\n{\n    ch.s = \"nar\"\n    ch.n = \"\"\n    ch.t = ch.t.replace(/^\\*nar1? /,\"\")\n    return ch\n}\n\n\nfunction nar2(ch)\n{\n    ch.s = \"nar2\"\n    ch.n = \"\"\n    ch.t = ch.t.replace(/^\\*nar2 /,\"\")\n    return ch\n}\n\nfunction nar3(ch)\n{\n    ch.s = \"nar3\"\n    ch.n = \"\"\n    ch.t = ch.t.replace(/^\\*nar3 /,\"\")\n    return ch\n}\n\nfunction dial1(ch)\n{\n    ch.s = \"dial1\"\n    ch.n = \"\"\n    ch.t = makeDialogTextWithSpeaker(ch.t)\n    return ch\n}\n\nfunction dial2(ch)\n{\n    ch.s = \"dial2\"\n    ch.n = \"\"\n    ch.t = makeDialogTextWithSpeaker(ch.t)\n    return ch\n}\n\nfunction dial3(ch)\n{\n    ch.s =\"dial3\"\n    ch.n =\"\"\n    ch.t = makeDialogTextWithSpeaker(ch.t)\n    return ch\n}\n\nfunction dial666(ch)\n{\n    ch.s =\"dial666\"\n    ch.n =\"\"\n    ch.t = nerthus.chatCmd.makeDialogTextWithSpeaker(ch.t)\n    return ch\n}\n\n\n\nfunction sys(ch)\n{\n    ch.s=\"sys_comm\"\n    ch.n=\"\"\n    ch.t=ch.t.replace(/^\\*sys /,\"\")\n    return ch\n}\n//\n// function map(ch)\n// {\n//     const cmd = ch.t.split(\" \").slice(1).join(\" \").split(\",\")\n//     const map_url = cmd[0]\n//     const map_id = cmd[1]\n//     if (map_id)\n//         nerthus.worldEdit.changeMap(map_url, 2, map_id)\n//     else\n//         nerthus.worldEdit.changeMap(map_url, 1)\n//\n//     return false\n// }\n//\n// function resetMap(ch)\n// {\n//     const map_id = ch.t.split(\" \").slice(1).join(\" \")\n//     nerthus.worldEdit.changeMap(\"\", 2, map_id)\n//\n//     return false\n// }\n//\n// function light(ch)\n// {\n//     let opacity = ch.t.split(\" \")[1]\n//     if(typeof opacity === \"undefined\")\n//         nerthus.night.dim()\n//     else\n//     {\n//         opacity = opacity.replace(\",\",\".\")\n//         nerthus.worldEdit.changeLight(1 - opacity)\n//     }\n//\n//     return false\n// }\n//\n// function addGraf(ch)\n// {  //cmd[0]=x, cmd[1]=y, cmd[2]=url, cmd[3]=tip_text, cmd[4]=isCol, cmd[5]=map_id\n//     const cmd = ch.t.split(\" \").slice(1).join(\" \").split(\",\")\n//     const x = parseInt(cmd[0])\n//     const y = parseInt(cmd[1])\n//     const _url = cmd[2]\n//     const name = cmd[3]\n//     const isCol = parseInt(cmd[4]) > 0\n//     const map_id = cmd[5]\n//\n//     nerthus.worldEdit.addNpc(x, y, _url, name, isCol, map_id)\n//\n//     return false\n// }\n//\n// function delGraf(ch)\n// {\n//     const cmd = ch.t.split(\" \")[1].split(\",\")\n//     const x = parseInt(cmd[0])\n//     const y = parseInt(cmd[1])\n//     const map_id = cmd[2]\n//\n//     nerthus.worldEdit.deleteNpc(x, y, map_id)\n//\n//     return false\n// }\n//\n//  function hide(ch)\n// {\n//     const cmd = ch.t.split(\" \")[1].split(\",\")\n//     const id = parseInt(cmd[0])\n//\n//     nerthus.worldEdit.hideGameNpc(id)\n//\n//     return false\n// }\n//\n// function weather(ch)\n// {\n//     var weather_id = parseInt(ch.t.split(\" \")[1])\n//     nerthus_weather_bard_id = weather_id\n//     nerthus.weather.set_weather(weather_id)\n//\n//     return false\n// }\n\nfunction me(ch)\n{\n    ch.s = \"me\"\n    ch.n = \"\"\n    ch.t = ch.t.replace(/^\\*me /, \"\")\n    return ch\n}\n\nconst map = {\n    'nar': nar1,\n    'nar1': nar1,\n    'nar2': nar2,\n    'nar3': nar3,\n    'dial': dial1,\n    'dial1': dial1,\n    'dial2': dial2,\n    'dial3': dial3,\n    'dial666': dial666,\n    'sys': sys\n}\nconst publicMap = {\n    'me': me\n}\n\nfunction initBasicChatCommands()\n{\n    for (const cmd in map)\n        Object(_chat_manager__WEBPACK_IMPORTED_MODULE_0__[\"registerChatCommand\"])(cmd, map[cmd], false)\n    for (const cmd in publicMap)\n        Object(_chat_manager__WEBPACK_IMPORTED_MODULE_0__[\"registerChatCommand\"])(cmd, publicMap[cmd], true)\n}\n\n\n//# sourceURL=webpack:///./src/chat/chat-basic-commands.js?");

/***/ }),

/***/ "./src/chat/chat-manager.js":
/*!**********************************!*\
  !*** ./src/chat/chat-manager.js ***!
  \**********************************/
/*! exports provided: initChatMgr, registerChatCommand */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initChatMgr\", function() { return initChatMgr; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"registerChatCommand\", function() { return registerChatCommand; });\n/* harmony import */ var _permissions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../permissions */ \"./src/permissions.js\");\n\n\nconst commandsMap = {}\nconst commandsPublicMap = {}\n\nfunction fixUrl(text)\n{\n    const url = RegExp(/(https?)\\*Krzywi się\\.\\*(\\S+)/)\n    return text.replace(url, '$1:/$2')\n}\n\nfunction handleChatObj(ch)\n{\n    // change message by directly editing object passed as reference\n    const cmd = fetch_cmd(ch)\n    if (cmd)\n    {\n        const callback = fetch_callback(cmd, ch)\n        if (callback)\n        {\n            ch.t = fixUrl(ch.t)\n            log('[' + ch.k + '] ' + ch.n + ' -> ' + ch.t) //[which tab] author -> command //TODO\n\n            return callback(ch)\n        }\n        return true\n    }\n    return true\n}\n\n\nfunction editNiMsg($msg, ch)\n{\n    $msg.addClass(ch.s)\n    const content = $msg.children().eq(2).contents()\n    $msg.children(2).addClass(ch.s)\n    for (let i = 0; i < content.length; i++)\n    {\n        const text = content.eq(i)\n        if (i === 0)\n            text.replaceWith(ch.t)\n        else\n            text.remove()\n    }\n    $msg.children().eq(0).contents().eq(0).replaceWith(ch.n)\n}\n\n\nfunction fetch_cmd(ch)\n{\n    if (ch.t[0] === '*')\n    {\n        const command = RegExp(/^\\*(\\S+)/).exec(ch.t)\n        //fixes bug with /dice, and presumably '* text' messages\n        if (command)\n            return command[1]\n    }\n}\n\nfunction fetch_callback(cmd, ch)\n{\n    if (commandsMap[cmd] && Object(_permissions__WEBPACK_IMPORTED_MODULE_0__[\"checkPermissionLvl\"])(ch.n))\n         return commandsMap[cmd]\n     else\n    return commandsPublicMap[cmd]\n}\n\nfunction run(arg)\n{\n    if (false)\n    {}\n    else\n    {\n        // return TRUE if you want message to NOT show in chat\n        // return FALSE if you want message to show in chat\n\n        // function returns negation so that on callbacks returning TRUE or OBJECT message is visible\n        // and on callbacks returning FALSE or UNDEFINED it is not\n        return !handleChatObj(arg)\n    }\n}\n\n\nfunction initChatMgr()\n{\n    if (false)\n    {}\n    else\n    {\n        g.chat.parsers.push(run)\n    }\n}\n\nfunction registerChatCommand(name, func, isPublic)\n{\n    if (isPublic)\n        commandsPublicMap[name] = func\n    else\n        commandsMap[name] = func\n}\n\n\n//# sourceURL=webpack:///./src/chat/chat-manager.js?");

/***/ }),

/***/ "./src/game-integration/loaders.js":
/*!*****************************************!*\
  !*** ./src/game-integration/loaders.js ***!
  \*****************************************/
/*! exports provided: loadOnEveryMap, initiateGameIntegrationLoaders */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"loadOnEveryMap\", function() { return loadOnEveryMap; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initiateGameIntegrationLoaders\", function() { return initiateGameIntegrationLoaders; });\nconst loadQueue = []\n\nfunction loadOnEveryMap(fun, data)\n{\n    loadQueue.push([fun, data])\n}\n\nfunction loadNewMapQueue()\n{\n    for (const i in this.loadQueue)\n    {\n        loadQueue[i][0](loadQueue[i][1])\n    }\n}\n\n\nfunction initiateGameIntegrationLoaders()\n{\n    if (false)\n    {}\n    else\n    {\n        // Observe map change if user have some kind of fast map switcher (e.g. 'Szybsze przechodzenie' by Adi Wilk)\n        window.map.__loaded = window.map.loaded\n        Object.defineProperty(window.map, 'loaded', {\n            set(val)\n            {\n                this.__loaded = val\n                loadNewMapQueue()\n\n                return val\n            },\n            get() { return this.__loaded }\n        })\n    }\n}\n\n\n//# sourceURL=webpack:///./src/game-integration/loaders.js?");

/***/ }),

/***/ "./src/interface/css-manager.js":
/*!**************************************!*\
  !*** ./src/interface/css-manager.js ***!
  \**************************************/
/*! exports provided: addBasicStyles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"addBasicStyles\", function() { return addBasicStyles; });\nfunction addBasicStyles()\n{\n    console.log(\"styles added!\")\n    $('<link rel=\"stylesheet\" href=\"' + \"http://localhost/nerthusaddon/\" +'css/style.css' + '\">').appendTo('head')\n}\n\n//# sourceURL=webpack:///./src/interface/css-manager.js?");

/***/ }),

/***/ "./src/interface/panel.js":
/*!********************************!*\
  !*** ./src/interface/panel.js ***!
  \********************************/
/*! exports provided: initPanel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initPanel\", function() { return initPanel; });\n/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../settings */ \"./src/settings.js\");\n\n\nlet $elm = $()\nconst defaultPosition = [6, 'top-right']\n\nconst settingsTranslations = {\n    'night': 'Pory dnia i nocy',\n    'weather': 'Efekty pogodowe',\n    'zodiac': 'Znaki zodiaku',\n    'hideNpcs': 'Ukrywanie NPCów'\n}\n\nfunction translate_option(name)\n{\n    if (settingsTranslations[name])\n        return settingsTranslations[name]\n    return name\n}\n\n/**\n * Contains functions that return strings that are representations of elements\n */\nconst constructElement = {}\n\nconstructElement.button = function (data)\n{\n    return (\n        '<a href=\"' + data.url + '\" target=\"_blank\" class=\"button\" tip=\"' + data.name + '\" data-tip=\"' + data.name + '\">' +\n        '<img src=\"' + \"http://localhost/nerthusaddon/\" + 'img/panel/' + data.icon + '\" alt=\"' + data.name + '\">' +\n        '</a>'\n    )\n}\n\nconstructElement.buttonGroup = function (groupData)\n{\n    const buttonGroup = []\n    const len = groupData.length\n    for (let i = 0; i < len; i++)\n        buttonGroup.push(this.button(groupData[i]))\n    return buttonGroup.join('')\n}\n\nconstructElement.settingCheckbox = function (optionName)\n{\n    const checked = _settings__WEBPACK_IMPORTED_MODULE_0__[\"settings\"][optionName] ? ' checked' : ''\n    return (\n        '<label class=\"setting-label\">' +\n        '<span class=\"setting-label-text\">' + translate_option(optionName) + '</span>' +\n        '<input class=\"setting-checkbox\" name=\"' + optionName + '\" type=\"checkbox\"' + checked + '>' +\n        '<span class=\"checkbox-outline\">' +\n        '<span class=\"checkmark\">' +\n        '<div class=\"checkmark-stem\"></div>' +\n        '<div class=\"checkmark-kick\"></div>' +\n        '</span>' +\n        '</span>' +\n        '</label>'\n    )\n}\n\nconstructElement.settings = function (options)\n{\n    const settingsList = []\n    for (const option in options)\n        settingsList.push(this.settingCheckbox(option))\n    const settings = settingsList.join('')\n\n    return (\n        '<div class=\"top-box\">' +\n        settings +\n        '</div>' +\n        '<div class=\"bottom-box\">' +\n        '<button class=\"button text-button save-button\">Zapisz</button>' +\n        '<button class=\"button text-button cancel-button\">Anuluj</button>' +\n        '</div>'\n    )\n}\n\nconstructElement.panel = function (buttonGroupLeft, buttonGroupCenter, buttonGroupRight, settings)\n{\n    return (\n        '<div id=\"nerthus-panel\">' +\n        '<div class=\"header-label-positioner\">' +\n        '<div class=\"header-label\">' +\n        '<div class=\"left-decor\"></div>' +\n        '<div class=\"right-decor\"></div>' +\n        '<span class=\"panel-name\">Panel Nerthusa</span>' +\n        '</div>' +\n        '</div>' +\n        '<div class=\"close-decor\">' +\n        '<button class=\"close-button\" />' +\n        '</div>' +\n        '<div class=\"background\">' +\n        '<div class=\"default-panel\">' +\n        '<div class=\"top-box\">' +\n        '<div id=\"button-group-left\" class=\"button-group\">' + buttonGroupLeft + '</div>' +\n        '<div id=\"button-group-center\" class=\"button-group\">' + buttonGroupCenter + '</div>' +\n        '<div id=\"button-group-right\" class=\"button-group\">' + buttonGroupRight + '</div>' +\n        '</div>' +\n        '<div class=\"bottom-box\">' +\n        '<button class=\"button text-button ok-button\">OK</button>' +\n        '</div>' +\n        '</div>' +\n        '<div class=\"settings-panel hidden\">' +\n        settings +\n        '</div>' +\n        '<button class=\"button nerthus-settings-button\" tip=\"Ustawienia\" data-tip=\"Ustawienia\">' +\n        '<img src=\"' + \"http://localhost/nerthusaddon/\" + 'img/panel/settings.png' + '\" alt=\"Ustawienia\">' +\n        '</button>' +\n        '</div>' +\n        '</div>'\n    )\n}\n\nconstructElement.icon = function ()\n{\n    return '<img id=\"nerthus-shield\" src=\"' + \"http://localhost/nerthusaddon/\" + 'img/nerthus_icon.gif' + '\" tip=\"Nerthus\" alt=\"Nerthus panel\">'\n}\n\nfunction createPanel(data, hidden)\n{\n    if (!$elm.parent || !$elm.parent('body').length)\n    {\n        const buttonGroupLeft = constructElement.buttonGroup(data.leftPanel)\n        const buttonGroupCenter = constructElement.buttonGroup(data.centerPanel)\n        const buttonGroupRight = constructElement.buttonGroup(data.rightPanel)\n        const settingsElement = constructElement.settings(_settings__WEBPACK_IMPORTED_MODULE_0__[\"settings\"])\n\n        $elm = $(constructElement.panel(buttonGroupLeft, buttonGroupCenter, buttonGroupRight, settingsElement))\n        const defaultPanel = $elm.find('.default-panel')\n        const settingsPanel = $elm.find('.settings-panel')\n        const panelName = $elm.find('.panel-name')\n        $elm.find('.nerthus-settings-button')\n            .click(function ()\n            {\n                defaultPanel.toggleClass('hidden')\n                settingsPanel.toggleClass('hidden')\n                const tip = settingsPanel.hasClass('hidden') ? 'Ustawienia' : 'Powrót'\n                const $this = $(this)\n                $this.toggleClass('back-to-default')\n                if (settingsPanel.hasClass('hidden'))\n                {\n                    $this.attr({'tip': 'Ustawienia', 'data-tip': 'Ustawienia'})\n                        .children().attr('src', \"http://localhost/nerthusaddon/\" +'img/panel/settings.png')\n                    panelName.text('Panel Nerthusa')\n                }\n                else\n                {\n                    $this.attr({'tip': 'Powrót', 'data-tip': 'Powrót'})\n                        .children().attr('src', \"http://localhost/nerthusaddon/\" +'img/panel/settings-back.png')\n                    panelName.text('Panel Nerthusa - ustawienia')\n                }\n            })\n            .end()\n            .find('.close-button, .cancel-button, .ok-button').click(function ()\n        {\n            $elm.css({visibility: 'hidden', opacity: '0'}) // reset opacity as we're still holding reference\n            defaultPanel.removeClass('hidden')\n            settingsPanel.addClass('hidden')\n        }).end()\n            .find('.save-button').click(function ()\n        {\n            saveSettings()\n            $elm.css({visibility: 'hidden', opacity: '0'}) // reset opacity as we're still holding reference\n            defaultPanel.removeClass('hidden')\n            settingsPanel.addClass('hidden')\n        }).end()\n\n        $elm\n            .css({\n                visibility: hidden ? 'hidden' : 'visible',\n                opacity: 0\n            })\n            .appendTo('body')\n            .css('opacity', hidden ? '0' : '1') // change opacity after appending to body for nice animation\n            .draggable({\n                start: function ()\n                {\n                    const lock = window.g ? window.g.lock : window.Engine.lock\n                    lock.add('nerthus-panel-drag')\n                },\n                stop: function ()\n                {\n                    const lock = window.g ? window.g.lock : window.Engine.lock\n                    lock.remove('nerthus-panel-drag')\n                }\n            })\n    }\n}\n\nfunction preloadPanel()\n{\n    if (!$elm.parent || !$elm.parent('body').length)\n        $.getJSON(\"http://localhost/nerthusaddon/\" + 'panel_links.json', function (data)\n        {\n            createPanel(data, true)\n        })\n}\n\nfunction togglePanel()\n{\n    if (!$elm.parent || !$elm.parent('body').length)\n        $.getJSON(\"http://localhost/nerthusaddon/\" + 'panel_links.json', createPanel)\n    else if ($elm.css('visibility') === 'visible')\n        $elm.css({visibility: 'hidden', opacity: '0'})\n    else\n        $elm.css({visibility: 'visible', opacity: '1'})\n}\n\nfunction saveSettings()\n{\n    $elm.find('.setting-checkbox').each(function () { Object(_settings__WEBPACK_IMPORTED_MODULE_0__[\"saveSetting\"])(this.name, this.checked)})\n    message('Zapisano, odśwież stronę')\n}\n\n\nfunction create_button_ni()\n{\n    if (Engine.interfaceStart && Object.keys(Engine.interface.getDefaultWidgetSet()).includes('nerthus'))\n    {\n        const serverStoragePos = Engine.serverStorage.get(Engine.interface.getPathToHotWidgetVersion())\n        if (serverStoragePos)\n        {\n            const nerthusPos = serverStoragePos.nerthus ? serverStoragePos.nerthus : defaultPosition\n            Engine.interface.createOneWidget('nerthus', {nerthus: nerthusPos}, true, [])\n        }\n        else setTimeout(create_button_ni.bind(this), 500)\n    }\n    else setTimeout(create_button_ni.bind(this), 500)\n}\n\nfunction initPanel()\n{\n    if (false)\n    {}\n    else\n    {\n        console.log(\"HMM\")\n        console.log(document.getElementById('interface'))\n        $(constructElement.icon())\n            .hover(preloadPanel.bind(this))\n            .click(togglePanel.bind(this))\n            .appendTo('#panel')\n    }\n}\n\n//# sourceURL=webpack:///./src/interface/panel.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _chat_chat_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chat/chat-manager */ \"./src/chat/chat-manager.js\");\n/* harmony import */ var _chat_chat_basic_commands__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chat/chat-basic-commands */ \"./src/chat/chat-basic-commands.js\");\n/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./settings */ \"./src/settings.js\");\n/* harmony import */ var _interface_panel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./interface/panel */ \"./src/interface/panel.js\");\n/* harmony import */ var _interface_css_manager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./interface/css-manager */ \"./src/interface/css-manager.js\");\n/* harmony import */ var _game_integration_loaders__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./game-integration/loaders */ \"./src/game-integration/loaders.js\");\n\n\n\n\n\n\n\n\nfunction start()\n{\n    console.log({\"npc\":[\"map_11.json\",\"map_15.json\",\"map_169.json\",\"map_16.json\",\"map_1838.json\",\"map_1975.json\",\"map_1.json\",\"map_2520.json\",\"map_257.json\",\"map_2663.json\",\"map_2887.json\",\"map_290.json\",\"map_291.json\",\"map_2.json\",\"map_330.json\",\"map_35.json\",\"map_361.json\",\"map_37.json\",\"map_38.json\",\"map_574.json\",\"map_864.json\",\"map_8.json\",\"\"]})\n    console.log('File prafix: ' + \"http://localhost/nerthusaddon/\")\n    //$('<link rel=\"stylesheet\" href=\"' + nerthus.addon.fileUrl(\"css/style.css\") + '\">').appendTo('head')\n    Object(_interface_css_manager__WEBPACK_IMPORTED_MODULE_4__[\"addBasicStyles\"])()\n    Object(_settings__WEBPACK_IMPORTED_MODULE_2__[\"loadSettings\"])()\n\n    Object(_game_integration_loaders__WEBPACK_IMPORTED_MODULE_5__[\"initiateGameIntegrationLoaders\"])()\n\n    Object(_chat_chat_manager__WEBPACK_IMPORTED_MODULE_0__[\"initChatMgr\"])()\n    Object(_chat_chat_basic_commands__WEBPACK_IMPORTED_MODULE_1__[\"initBasicChatCommands\"])()\n\n    Object(_interface_panel__WEBPACK_IMPORTED_MODULE_3__[\"initPanel\"])()\n    console.log('Nerthus addon fully loaded')\n}\n\n\nif (false)\n{}\nelse\n{\n    g.loadQueue.push({'fun': start})\n}\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ }),

/***/ "./src/permissions.js":
/*!****************************!*\
  !*** ./src/permissions.js ***!
  \****************************/
/*! exports provided: checkPermissionLvl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"checkPermissionLvl\", function() { return checkPermissionLvl; });\n\n/*\n    0: normal player\n    1: narrator\n    2: radny\n    3: xxxx\n    100: dev or other spec\n */\n\nfunction checkPermissionLvl(nick) {\n    return 2\n}\n\n//# sourceURL=webpack:///./src/permissions.js?");

/***/ }),

/***/ "./src/settings.js":
/*!*************************!*\
  !*** ./src/settings.js ***!
  \*************************/
/*! exports provided: settings, saveSetting, loadSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"settings\", function() { return settings; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"saveSetting\", function() { return saveSetting; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"loadSettings\", function() { return loadSettings; });\nconst settings = {'night': true, 'weather': true, 'zodiac': true, 'hideNpcs': false}\n\nfunction saveSetting(name, value)\n{\n    settings[name] = value\n    localStorage.nerthus_options = JSON.stringify(settings)\n}\n\n\nfunction loadSettings()\n{\n    if (localStorage.nerthus_options)\n    {\n        const loadedSettings = JSON.parse(localStorage.nerthus_options)\n        for (const opt in loadedSettings)\n            if (loadedSettings.hasOwnProperty(opt))\n                settings[opt] = loadedSettings[opt]\n    }\n    saveSetting(settings)\n    return settings\n}\n\n\n//# sourceURL=webpack:///./src/settings.js?");

/***/ })

/******/ });