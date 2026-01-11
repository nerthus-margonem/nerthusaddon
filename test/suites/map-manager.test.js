import sinon from "sinon";
import { describe, expect, it, beforeEach } from "vitest";
import { MapManager } from "../../src/app/map-manager.js";
import { resolveUrl } from "../../src/app/utility-functions";

describe("maps", function () {
  describe("applyCurrentMapChange()", function () {
    beforeEach(function () {
      map = {
        id: 1,
      };
    });
    it("should not change anything when no custom map defined", function () {
      const changeCustomStyle = sinon.fake();
      const removeCustomStyle = sinon.fake();

      const module = new MapManager(
        {
          default: {},
          "current-season": { 1: "map-url" },
        },
        sinon.fake(),
        changeCustomStyle,
        removeCustomStyle,
        sinon.fake.returns("current-season"),
      );

      map.id = 0;
      module.applyCurrentMapChange();

      if (INTERFACE === "SI") {
        expect(changeCustomStyle.called).toStrictEqual(false);
        expect(removeCustomStyle.calledOnce).toStrictEqual(true);
        expect(
          removeCustomStyle.calledWith("map-background-image"),
        ).toStrictEqual(true);
      }
    });

    it("should change map when there is custom map in current season", function () {
      const changeCustomStyle = sinon.fake();
      const removeCustomStyle = sinon.fake();
      const module = new MapManager(
        {
          default: {},
          "current-season": { 1: "map-url" },
        },
        sinon.fake(),
        changeCustomStyle,
        removeCustomStyle,
        sinon.fake.returns("current-season"),
      );

      map.id = 1;
      module.applyCurrentMapChange();

      if (INTERFACE === "SI") {
        expect(changeCustomStyle.calledOnce).toStrictEqual(true);
        expect(removeCustomStyle.called).toStrictEqual(false);
        expect(
          changeCustomStyle.calledWith(
            "map-background-image",
            `#ground {
                            background-image: url(${resolveUrl("map-url")}) !important;
                            background-color: transparent !important;
                        }`.replace(/ /g, ""),
          ),
        ).toStrictEqual(true);
      }
    });

    it("should change the map when there is a custom map in default", function () {
      const changeCustomStyle = sinon.fake();
      const removeCustomStyle = sinon.fake();
      const module = new MapManager(
        {
          default: { 1: "map-url" },
          "current-season": {},
        },
        sinon.fake(),
        changeCustomStyle,
        removeCustomStyle,
        sinon.fake.returns("current-season"),
      );

      map.id = 1;
      module.applyCurrentMapChange();

      if (INTERFACE === "SI") {
        expect(changeCustomStyle.calledOnce).toStrictEqual(true);
        expect(removeCustomStyle.called).toStrictEqual(false);
        expect(
          changeCustomStyle.calledWith(
            "map-background-image",
            `#ground {
                            background-image: url(${resolveUrl("map-url")}) !important;
                            background-color: transparent !important;
                        }`.replace(/ /g, ""),
          ),
        ).toStrictEqual(true);
      }
    });

    it("should load a season map when both default and season maps are defined", function () {
      const changeCustomStyle = sinon.fake();
      const removeCustomStyle = sinon.fake();
      const module = new MapManager(
        {
          default: { 1: "default-map-url" },
          "current-season": { 1: "season-map-url" },
        },
        sinon.fake(),
        changeCustomStyle,
        removeCustomStyle,
        sinon.fake.returns("current-season"),
      );

      map.id = 1;
      module.applyCurrentMapChange();

      if (INTERFACE === "SI") {
        expect(changeCustomStyle.calledOnce).toStrictEqual(true);
        expect(removeCustomStyle.called).toStrictEqual(false);
        expect(
          changeCustomStyle.calledWith(
            "map-background-image",
            `#ground {
                            background-image: url(${resolveUrl("season-map-url")}) !important;
                            background-color: transparent !important;
                        }`.replace(/ /g, ""),
          ),
        ).toStrictEqual(true);
      }
    });

    it("should not change the map when there is a custom map but not in the current season", function () {
      const changeCustomStyle = sinon.fake();
      const removeCustomStyle = sinon.fake();
      const module = new MapManager(
        {
          default: {},
          "current-season": {},
          "other-season": { 1: "season-map-url" },
        },
        sinon.fake(),
        changeCustomStyle,
        removeCustomStyle,
        sinon.fake.returns("current-season"),
      );

      map.id = 1;
      module.applyCurrentMapChange();

      if (INTERFACE === "SI") {
        expect(changeCustomStyle.called).toStrictEqual(false);
        expect(removeCustomStyle.called).toStrictEqual(true);
      }
    });

    it("should not change map when there is custom map but wrong id", function () {
      const changeCustomStyle = sinon.fake();
      const removeCustomStyle = sinon.fake();
      const module = new MapManager(
        {
          default: {},
          "current-season": { 2: "map-url" },
        },
        sinon.fake(),
        changeCustomStyle,
        removeCustomStyle,
        sinon.fake.returns("current-season"),
      );

      map.id = 1;
      module.applyCurrentMapChange();

      if (INTERFACE === "SI") {
        expect(changeCustomStyle.called).toStrictEqual(false);
        expect(removeCustomStyle.calledOnce).toStrictEqual(true);
        expect(
          removeCustomStyle.calledWith("map-background-image"),
        ).toStrictEqual(true);
      }
    });
  });
});
