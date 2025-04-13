const minimal_npc = function (name = "Stefan", x = 8, y = 42, url = "") {
  return { name: name, x: x, y: y, url: url };
};

let NPC = minimal_npc("Kici");
before(function () {
  log = function (msg) {
    console.log(msg);
  };
  nerthus = {};
  nerthus.defer = function () {};
  nerthus.addon = {};
  nerthus.addon.PREFIX = "NERTH_PREFIX:";
  nerthus.addon.fileUrl = function (url) {
    return this.PREFIX + url;
  };

  nerthus.worldEdit = {
    coordsToId(x, y) {
      return 50000000 + x * 1000 + y;
    },
  };
  Image = function (url) {
    Object.defineProperty(this, "onload", {
      set(x) {
        this._onload = x;
        setTimeout(this._onload, 1);
        return this._onload;
      },
    });
    return url;
  };

  expect = require("expect.js");
  require("../NN_npc.js");

  var jsdom = require("jsdom");
  const { JSDOM } = jsdom;
  const { window } = new JSDOM();
  const { document } = new JSDOM("").window;
  global.document = document;
  $ = require("jquery")(window);
  $.fn.load = function () {
    return this;
  }; //load stub

  g = {};
  g.npccol = {}; //npc colision set
  g.lock = {
    //lock mock
    lock: null,
    add: function (lock) {
      this.lock = lock;
    },
    remove: function () {
      this.lock = null;
    },
  };
  g.talk = {
    scrollCheckInterval: 0,
  };
  map = {
    resizeView: function () {},
  };

  setInterval = function () {};
  clearInterval = function () {};
  removeScrollbar = function () {};
  addScrollbar = function () {};

  Engine = {
    hero: {
      d: {},
    },
  };
  hero = {};

  NPC.x = 8;
  NPC.y = 4;
  NPC.url = "http://game1.margonem.pl/obrazki/itemy/eve/ka-kotek.gif";
  NPC.dialog = {
    //Simple dialog
    0: ["Hej wam!", "A no Hej", "Elo"],
    //normal dialog
    1: ["A jakoś leci", "a tak sobie... ->2", "dobrze ->END"],
    //normal dialog
    2: ["To już koniec", "a no konie ->END"],
    //placeholder #NAME
    3: ["Witaj #NAME dawno cie nie widaiłem", "Ja #NAME mam wiele obowiązków"],
  };

  dialog = nerthus.npc.dialog;

  //dialog object
  $("<div>")
    .attr("id", "dialog")
    .append(
      $("<div>")
        .attr("id", "dlgin")
        .append($("<div>").attr("id", "message").addClass("message"))
        .append($("<div>").attr("id", "replies").addClass("replies")),
    )
    .appendTo("body");

  //base object
  $("<div>").attr("id", "base").appendTo("body");
});

beforeEach(function () {
  $("#body").empty();
  $("#base").empty();
  $(".message").empty();
  $(".replies").empty();

  hero = {};
});

suite("npc dialog parse message");

test("message shall includes first dialog from given index", function () {
  const INDEX = 0;
  const message = dialog.parse_message(NPC, INDEX);
  expect(message).to.contain(NPC.dialog[INDEX][0]);
});

suite("npc dialog parse replies");

test("replies shall includes dialogs from given index expect first one, first is message", function () {
  const INDEX = 0;
  const replies = dialog.parse_replies(NPC, INDEX);

  expect(replies).to.have.length(2);

  expect(replies[0].text).to.contain(NPC.dialog[INDEX][1]);
  expect(replies[0].click).to.not.ok();
  expect(replies[0].icon).to.not.ok();

  expect(replies[1].text).to.contain(NPC.dialog[INDEX][2]);
  expect(replies[1].click).to.not.ok();
  expect(replies[1].icon).to.not.ok();
});

test("replies shall not contains arrows (->)", function () {
  const INDEX = 1;
  const replies = dialog.parse_replies(NPC, INDEX);
  const ARROW = "->";

  expect(NPC.dialog[INDEX][1]).to.contain(ARROW);
  expect(NPC.dialog[INDEX][2]).to.contain(ARROW);

  expect(replies).to.have.length(2);
  expect(replies[0].text).to.not.contain(ARROW);
  expect(replies[1].text).to.not.contain(ARROW);
});

test("replies with ->END shall has LINE_EXIT class and click handler", function () {
  const INDEX = 1;
  const replies = dialog.parse_replies(NPC, INDEX);
  const END_MARKER = "->END";

  expect(NPC.dialog[INDEX][2]).to.contain(END_MARKER);

  expect(replies[1].icon).to.be(dialog.decorator.classes.EXIT);
  expect(replies[1].click).to.be.ok();
});

test("replies with ->$LINE shall has LINE_OPTION class and click handler", function () {
  const INDEX = 1;
  const replies = dialog.parse_replies(NPC, INDEX);
  const GO_TO_LINE_MARKER = /->\d+/;

  expect(NPC.dialog[INDEX][1]).to.match(GO_TO_LINE_MARKER);

  expect(replies[0].icon).to.be(dialog.decorator.classes.LINE);
  expect(replies[0].click).to.be.ok();
});

suite("npc dialog placeholders");

test("placeholder #NAME is replace by hero.nick", function () {
  const INDEX = 3;
  const NICK = "Karyna";
  hero = { nick: NICK };

  const replies = dialog.parse_replies(NPC, INDEX);
  const message = dialog.parse_message(NPC, INDEX);

  expect(NPC.dialog[INDEX][0]).to.contain("#NAME");
  expect(NPC.dialog[INDEX][1]).to.contain("#NAME");

  expect(message).to.not.contain("#NAME");
  expect(message).to.contain(NICK);

  expect(replies[0].text).to.not.contain("#NAME");
  expect(replies[0].text).to.contain(NICK);
});

suite("npc dialog API");

test("open dialog display dialog from given index", function () {
  const INDEX = 0;
  dialog.open(NPC, INDEX);

  const message = $("#dialog #dlgin .message").html();
  expect(message).to.contain(NPC.nick);
  expect(message).to.contain(NPC.dialog[INDEX][0]);

  const replies = $("#dialog #dlgin .replies").html();
  expect(replies).to.contain(NPC.dialog[INDEX][1]);
  expect(replies).to.contain(NPC.dialog[INDEX][2]);
});

test("reply with ->$LINE go to next dialog", function () {
  const BEGIN_INDEX = 1;
  const NEXT_INDEX = 2;
  dialog.open(NPC, BEGIN_INDEX);

  expect($("#dialog #dlgin .message").html()).to.contain(NPC.nick);
  expect($("#dialog #dlgin .message").html()).to.contain(
    NPC.dialog[BEGIN_INDEX][0],
  );

  $("#dialog #dlgin .replies li")[0].click(); // dialog[1][1] go to dialog 2
  expect($("#dialog #dlgin .message").html()).to.contain(NPC.nick);
  expect($("#dialog #dlgin .message").html()).to.contain(
    NPC.dialog[NEXT_INDEX][0],
  );
});

test("reply with ->END close dialog", function () {
  const INDEX = 1;
  dialog.open(NPC, INDEX);

  expect($("#dialog #dlgin .message").html()).to.contain(NPC.nick);
  expect($("#dialog #dlgin .message").html()).to.contain(NPC.dialog[INDEX][0]);

  expect($("#dialog").css("display")).to.be("block");

  $("#dialog #dlgin .replies li")[1].click(); //dialog[1][2] go to END

  expect($("#dialog").css("display")).to.be("none");
});

test("dialog.open lock game, dialog.close unlock game", function () {
  expect(g.lock.lock).not.ok();

  dialog.open(NPC, 0);
  expect(g.lock.lock).ok();

  dialog.close();
  expect(g.lock.lock).not.ok();
});

suite("npc compose");

test("create npc with tip equal to name", function () {
  const npc = minimal_npc();
  const tip = npc.hasOwnProperty("tip") ? npc.tip : npc.name;
  const customNpc = new nerthus.npc.CustomNpc(npc.x, npc.y, npc.url, tip);
  const $npc = nerthus.npc.compose(customNpc);

  expect($npc.attr("tip")).to.be.ok();
  expect($npc.attr("tip")).to.contain(npc.name);
});

test("create tipless npc", function () {
  const npc = minimal_npc();
  npc.tip = null;
  const tip = npc.hasOwnProperty("tip") ? npc.tip : "<b>" + npc.name + "</b>";
  const customNpc = new nerthus.npc.CustomNpc(npc.x, npc.y, npc.url, tip);
  const $npc = nerthus.npc.compose(customNpc);

  expect($npc.attr("tip")).not.ok();
});

suite("npc deployment");

test("deployed npc is added to #base", function () {
  expect($("#base").children()).empty();

  nerthus.npc.deploy(NPC);

  expect($("#base").children()).not.empty();
  expect($("#base").children().hasClass("nerthus-npc")).ok();
});

test("npc has tip same as name", function () {
  nerthus.npc.deploy(NPC);
  expect($("#base").children().attr("tip")).to.contain(NPC.name);
});

test("simple npc has no collision", function () {
  var npc = minimal_npc();
  nerthus.npc.deploy(npc);

  expect(npc.collision).not.ok();
  expect(g.npccol).empty();
});

test("npc with collision", function () {
  var npc = minimal_npc();
  npc.collision = true;
  nerthus.npc.deploy(npc);

  expect(npc.collision).ok();
  expect(g.npccol[npc.x + 256 * npc.y]).ok();
});

test("npc with normal url", function () {
  const npc = minimal_npc();
  npc.url = "http://img.gif";
  nerthus.npc.deploy(npc);
  expect($("#base").children().css("background-image")).to.be.equal(
    "url(" + npc.url + ")",
  );
});

test("npc with url starting with # should be resolved as url pointing to local addon path", function () {
  const URL = "/img/npc/sir.gif";
  var npc = minimal_npc();
  npc.url = "#" + URL;
  nerthus.npc.deploy(npc);

  expect($("#base").children().css("background-image")).to.be(
    "url(" + nerthus.addon.PREFIX + URL + ")",
  );
});

suite("npc time");

setTime = function (hour, minutes) {
  var _date = Date;
  Date = function () {
    var date = new _date(0);
    date.setHours(hour, minutes);
    return date;
  };
  return _date;
};

npc_expected_in_time = function (npc_time, current_time) {
  var _date = setTime(current_time.split(":")[0], current_time.split(":")[1]);

  var npc = minimal_npc();
  npc.time = npc_time;
  nerthus.npc.deploy(npc);

  expect(nerthus.npc.is_deployable(npc)).ok();
  expect($("#base").children()).not.empty();

  Date = _date;
};

npc_not_expected_in_time = function (npc_time, current_time) {
  var _date = setTime(current_time.split(":")[0], current_time.split(":")[1]);

  var npc = minimal_npc();
  npc.time = npc_time;
  nerthus.npc.deploy(npc);

  expect(nerthus.npc.is_deployable(npc)).not.ok();
  expect($("#base").children()).empty();

  Date = _date;
};

test("npc with time shell not be deployed before expected time 5:00 vs 7:00-18:00", function () {
  npc_not_expected_in_time("7-18", "5:00");
});

test("npc with time shell not be deployed after expected time 20:00 vs 7-18", function () {
  npc_not_expected_in_time("7-18", "20:00");
});

test("npc with time shell be deployed in expected time 10:00 vs 7-18", function () {
  npc_expected_in_time("7-18", "10:00");
});

test("npc with time shell not be deployed in unexpected time 10:00 vs 20-6", function () {
  npc_not_expected_in_time("20-6", "10:00");
});

test("npc with time shell be deployed in expected time 22:00 vs 20-6", function () {
  npc_expected_in_time("20-6", "22:00");
});

test("npc with time shell be deployed in expected time 04:00 vs 20-6", function () {
  npc_expected_in_time("20-6", "4:00");
});

test("npc with time shell be deployed in time range begin time 07:00 vs 7-18", function () {
  npc_expected_in_time("7-18", "7:00");
});

test("npc with time shell be deployed in time range end time 18:00 vs 7-18", function () {
  npc_expected_in_time("7-18", "18:00");
});

suite("npc time with minutes");

test("npc with time shell be deployed in expected time 10:20 vs 10:10-10:30", function () {
  npc_expected_in_time("10:10-10:30", "10:20");
});

test("npc with time shell not be deployed before expected time 10:05 vs 10:10-10:30", function () {
  npc_not_expected_in_time("10:10-10:30", "10:05");
});

test("npc with time shell not be deployed after expected time 10:35 vs 10:10-10:30", function () {
  npc_not_expected_in_time("10:10-10:30", "10:35");
});

test("npc with time shell be deployed in time range begin time 07:05 vs 7:05-18:15", function () {
  npc_expected_in_time("7:05-18:15", "7:05");
});

test("npc with time shell be deployed in time range end time 18:15 vs 7:05-18:15", function () {
  npc_expected_in_time("7:05-18:15", "18:15");
});

suite("npc days");

test("npc with empty days should not be present", function () {
  var npc = minimal_npc();
  npc.days = [];

  expect(nerthus.npc.is_deployable(npc)).not.ok();

  nerthus.npc.deploy(npc);
  expect($("#base").children()).empty();
});

test("npc should be present only in days defined in npc.days, weekend only npc [5,6]", function () {
  var setWeekDay = function (dayOfWeek) {
    var _date = Date;
    Date = function () {
      var date = new _date(0);
      date.setDate(date.getDate() - date.getDay() + dayOfWeek);
      return date;
    };
    return _date;
  };

  var npc = minimal_npc();
  npc.days = [5, 6];

  let _date = setWeekDay(0);
  expect(nerthus.npc.is_deployable(npc)).not.ok();

  _date = setWeekDay(1);
  expect(nerthus.npc.is_deployable(npc)).not.ok();

  _date = setWeekDay(2);
  expect(nerthus.npc.is_deployable(npc)).not.ok();

  _date = setWeekDay(3);
  expect(nerthus.npc.is_deployable(npc)).not.ok();

  _date = setWeekDay(4);
  expect(nerthus.npc.is_deployable(npc)).not.ok();

  _date = setWeekDay(5);
  expect(nerthus.npc.is_deployable(npc)).ok();

  _date = setWeekDay(6);
  expect(nerthus.npc.is_deployable(npc)).ok();

  nerthus.npc.deploy(npc);
  expect($("#base").children()).not.empty();

  Date = _date;
});

suite("npc date DD.MM.YYYY-DD.MM.YYYY");

setDate = function (day, month, year) {
  var _date = Date;
  Date = function () {
    var date = new _date(0);
    date.setFullYear(year, month - 1, day);
    return date;
  };
  return _date;
};

npc_expected_in_date = function (npc_date, current_date) {
  var _date = setDate(current_date[0], current_date[1], current_date[2]);

  var npc = minimal_npc();
  npc.date = npc_date;

  expect(nerthus.npc.is_deployable(npc)).ok();

  nerthus.npc.deploy(npc);
  expect($("#base").children()).not.empty();

  Date = _date;
};

npc_not_expected_in_date = function (npc_date, current_date) {
  var _date = setDate(current_date[0], current_date[1], current_date[2]);

  var npc = minimal_npc();
  npc.date = npc_date;

  expect(nerthus.npc.is_deployable(npc)).not.ok();

  nerthus.npc.deploy(npc);
  expect($("#base").children()).empty();

  Date = _date;
};

test("npc with date should not be present before date 1.1.2020 vs 2.2.2020-4.4.2020", function () {
  npc_not_expected_in_date("2.2.2020-4.4.2020", [1, 1, 2020]);
});

test("npc with date should not be present after date 5.5.2020 vs 2.2.2020-4.4.2020", function () {
  npc_not_expected_in_date("2.2.2020-4.4.2020", [5, 5, 2020]);
});

test("npc with date should be present when date fit in range 3.3.2020 vs 2.2.2020-4.4.2020", function () {
  npc_expected_in_date("2.2.2020-4.4.2020", [3, 3, 2020]);
});

test("npc with date should be present in first day of range 2.2.2020 vs 2.2.2020-4.4.2020", function () {
  npc_expected_in_date("2.2.2020-4.4.2020", [2, 2, 2020]);
});

test("npc with date should be present in last day of range 4.4.2020 vs 2.2.2020-4.4.2020", function () {
  npc_expected_in_date("2.2.2020-4.4.2020", [4, 4, 2020]);
});

suite("npc date DD.MM-DD.MM");

test("npc with date should not be present before date 1.1.2020 vs 15.1-15.5", function () {
  npc_not_expected_in_date("15.1-15.5", [1, 1, 2020]);
});

test("npc with date should not be present after date 25.5.2020 vs 15.1-15.5", function () {
  npc_not_expected_in_date("15.1-15.5", [25, 5, 2020]);
});

test("npc with date should be present when date fit in range 3.3.2020 vs 15.1-15.5", function () {
  npc_expected_in_date("15.1-15.5", [3, 3, 2020]);
});

test("npc with date should be present in first day of range 15.1.2020 vs 15.1-15.5", function () {
  npc_expected_in_date("15.1-15.5", [15, 1, 2020]);
});

test("npc with date should be present in last day of range 15.5.2020 vs 15.1-15.5", function () {
  npc_expected_in_date("15.1-15.5", [15, 5, 2020]);
});

suite("npc date DD-DD");

test("npc with date should not be present before date 1.1.2020 vs 5-15", function () {
  npc_not_expected_in_date("5-15", [1, 1, 2020]);
});

test("npc with date should not be present after date 25.5.2020 vs 5-15", function () {
  npc_not_expected_in_date("5-15", [25, 5, 2020]);
});

test("npc with date should be present when date fit in range 8.8.2020 vs 5-15", function () {
  npc_expected_in_date("5-15", [8, 8, 2020]);
});

test("npc with date should be present in first day of range 5.8.2020 vs 5-15", function () {
  npc_expected_in_date("5-15", [5, 8, 2020]);
});

test("npc with date should be present in last day of range 15.8.2020 vs 5-15", function () {
  npc_expected_in_date("5-15", [15, 8, 2020]);
});

suite("hide npcs");

test("npc with lvl higher than hero", () => {
  const npc = {
    lvl: 200,
  };
  hero.lvl = 100;

  expect(nerthus.npc.is_deletable(npc)).to.be(false);
});

test("npc with lvl higher than hero - NI", () => {
  const npc = {
    lvl: 200,
  };
  Engine.hero.d.lvl = 100;
  expect(nerthus.npc.is_deletable_ni(npc)).to.be(false);
});

test("npc with lvl equal to hero", () => {
  const npc = {
    lvl: 100,
  };
  hero.lvl = 100;

  expect(nerthus.npc.is_deletable(npc)).to.be(false);
});

test("npc with lvl equal to hero - NI", () => {
  const npc = {
    lvl: 100,
  };
  Engine.hero.d.lvl = 100;
  expect(nerthus.npc.is_deletable_ni(npc)).to.be(false);
});

test("npc with 12 lvls less than hero", () => {
  const npc = {
    lvl: 88,
  };
  hero.lvl = 100;

  expect(nerthus.npc.is_deletable(npc)).to.be(false);
});

test("npc with 12 lvls less than hero - NI", () => {
  const npc = {
    lvl: 88,
  };
  Engine.hero.d.lvl = 100;
  expect(nerthus.npc.is_deletable_ni(npc)).to.be(false);
});

test("npc with 100 lvls less than hero", () => {
  const npc = {
    lvl: 1,
  };
  hero.lvl = 101;

  expect(nerthus.npc.is_deletable(npc)).to.be(true);
});

test("npc with 100 lvls less than hero - NI", () => {
  const npc = {
    lvl: 1,
  };
  Engine.hero.d.lvl = 101;
  expect(nerthus.npc.is_deletable_ni(npc)).to.be(true);
});

test("npc with 13 lvls less than hero", () => {
  const npc = {
    lvl: 87,
  };
  hero.lvl = 100;

  expect(nerthus.npc.is_deletable(npc)).to.be(false);
});

test("npc with 13 lvls less than hero - NI", () => {
  const npc = {
    lvl: 87,
  };
  Engine.hero.d.lvl = 100;
  expect(nerthus.npc.is_deletable_ni(npc)).to.be(false);
});

suite("misc npc stuff");

test("resolve url - normal", () => {
  const url = "http://example.com/example.png";
  expect(nerthus.npc.resolve_url(url)).to.equal(
    "http://example.com/example.png",
  );
});

test("resolve url - relative", () => {
  const url = "#example.png";
  expect(nerthus.npc.resolve_url(url)).to.equal("NERTH_PREFIX:example.png");
});
