suite("panel");

before(function () {
  nerthus = {};
  nerthus.defer = function () {};
  nerthus.addon = {
    fileUrl(data) {
      return data;
    },
  };

  const jsdom = require("jsdom");
  const { JSDOM } = jsdom;
  const { window } = new JSDOM();
  const { document } = new JSDOM("").window;
  global.document = document;
  $ = require("jquery")(window);
  $.fn.load = function () {
    return this;
  }; //load stub
  $.fn.draggable = function () {}; // draggable support

  expect = require("expect.js");
  require("../NN_panel.js");

  nerthus.panel.settings_translations = {
    translate: "przetłumaczony",
  };

  nerthus.options = {
    OPTION1: true,
    OPTION2: false,
  };
  nerthus.graf = { shield: "shield.png" };

  const htmlRegexp =
    /<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>/i;

  isHTML = function (str) {
    return htmlRegexp.test(str);
  };

  data = {
    leftPanel: [
      {
        icon: "example.png",
        name: "example",
        url: "example.com",
      },
    ],
    centerPanel: [
      {
        icon: "example2.png",
        name: "example2",
        url: "example2.com",
      },
    ],
    rightPanel: [
      {
        icon: "example3.png",
        name: "example3",
        url: "example3.com",
      },
    ],
  };
});

afterEach(() => {
  $("body > #nerthus-interface").remove();
});

test("translate", () => {
  expect(nerthus.panel.translate_option("translate")).to.equal(
    "przetłumaczony",
  );
});

test("translate untranslatable", () => {
  expect(nerthus.panel.translate_option("untranslatable")).to.equal(
    "untranslatable",
  );
});

test("constructElement.button returns proper HTML string", () => {
  const data = {
    url: "example.com",
    name: "example",
    icon: "example.png",
  };
  const str = nerthus.panel.constructElement.button(data);
  expect(isHTML(str)).to.be.ok();
});

test("constructElement.buttonGroup returns proper HTML string", () => {
  const str = nerthus.panel.constructElement.buttonGroup(data.leftPanel);
  expect(isHTML(str)).to.be.ok();
});

test("constructElement.settingCheckbox returns proper HTML string", () => {
  const str = nerthus.panel.constructElement.settingCheckbox();
  expect(isHTML(str)).to.be.ok();
});

test("constructElement.settings returns proper HTML string", () => {
  const str = nerthus.panel.constructElement.settings(nerthus.options);
  expect(isHTML(str)).to.be.ok();
});

test("constructElement.interface returns proper HTML string", () => {
  const str = nerthus.panel.constructElement.panel(
    data.leftPanel,
    data.centerPanel,
    data.rightPanel,
    nerthus.options,
  );
  expect(isHTML(str)).to.be.ok();
});

test("constructElement.icon returns proper HTML string", () => {
  const str = nerthus.panel.constructElement.icon();
  expect(isHTML(str)).to.be.ok();
});

test("createPanel properly appends DOM into body", () => {
  nerthus.panel.createPanel(data);
  expect($("body > #nerthus-interface").length).to.be.equal(1);
});
test("createPanel doesn't create second interface", () => {
  nerthus.panel.createPanel(data);
  nerthus.panel.createPanel(data);
  expect($("body > #nerthus-interface").length).to.be.equal(1);
});

test("$elm is proper jQuery object", () => {
  nerthus.panel.createPanel(data);
  expect(nerthus.panel.$elm instanceof $).to.be(true);
});

test("clicking settings button toggles between default and settings panels", () => {
  nerthus.panel.createPanel(data);

  const $defaultPanel = $(".default-interface");
  const $settingsPanel = $(".settings-interface");
  const $settingsButton = $(".nerthus-settings-button");

  expect($defaultPanel.hasClass("hidden")).to.be(false);
  expect($settingsPanel.hasClass("hidden")).to.be(true);
  $settingsButton.click();
  expect($defaultPanel.hasClass("hidden")).to.be(true);
  expect($settingsPanel.hasClass("hidden")).to.be(false);
  $settingsButton.click();
  expect($defaultPanel.hasClass("hidden")).to.be(false);
  expect($settingsPanel.hasClass("hidden")).to.be(true);
});
