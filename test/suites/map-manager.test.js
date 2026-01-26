import { MapManager } from "../../src/app/map-manager.js";
import { resolveUrl } from "../../src/app/utility-functions";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("maps", function () {
  describe("applyCurrentMapChange()", function () {
    beforeEach(function () {
      map = {
        id: 1,
      };
    });
    it("should not change anything when no custom map defined", function () {
      const changeCustomStyle = vi.fn();
      const removeCustomStyle = vi.fn();

      const module = new MapManager(
        {
          default: {},
          "current-season": { 1: "map-url" },
        },
        vi.fn(),
        changeCustomStyle,
        removeCustomStyle,
        vi.fn().mockReturnValue("current-season"),
      );

      map.id = 0;
      module.applyCurrentMapChange();

      if (INTERFACE === "SI") {
        expect(changeCustomStyle).not.toHaveBeenCalled();
        expect(removeCustomStyle).toHaveBeenCalledOnce();
        expect(removeCustomStyle).toBeCalledWith("map-background-image");
      }
    });

    it("should change map when there is custom map in current season", function () {
      const changeCustomStyle = vi.fn();
      const removeCustomStyle = vi.fn();
      const module = new MapManager(
        {
          default: {},
          "current-season": { 1: "map-url" },
        },
        vi.fn(),
        changeCustomStyle,
        removeCustomStyle,
        vi.fn().mockReturnValue("current-season"),
      );

      map.id = 1;
      module.applyCurrentMapChange();

      if (INTERFACE === "SI") {
        expect(changeCustomStyle).toHaveBeenCalledOnce();
        expect(removeCustomStyle).not.toHaveBeenCalled();
        expect(changeCustomStyle).toBeCalledWith(
          "map-background-image",
          `#ground {
              background-image: url(${resolveUrl("map-url")}) !important;
              background-color: transparent !important;
          }`.replaceAll(" ", ""),
        );
      }
    });

    it("should change the map when there is a custom map in default", function () {
      const changeCustomStyle = vi.fn();
      const removeCustomStyle = vi.fn();
      const module = new MapManager(
        {
          default: { 1: "map-url" },
          "current-season": {},
        },
        vi.fn(),
        changeCustomStyle,
        removeCustomStyle,
        vi.fn().mockReturnValue("current-season"),
      );

      map.id = 1;
      module.applyCurrentMapChange();

      if (INTERFACE === "SI") {
        expect(changeCustomStyle).toHaveBeenCalledOnce();
        expect(removeCustomStyle).not.toHaveBeenCalled();
        expect(changeCustomStyle).toBeCalledWith(
          "map-background-image",
          `#ground {
              background-image: url(${resolveUrl("map-url")}) !important;
              background-color: transparent !important;
          }`.replaceAll(" ", ""),
        );
      }
    });

    it("should load a season map when both default and season maps are defined", function () {
      const changeCustomStyle = vi.fn();
      const removeCustomStyle = vi.fn();
      const module = new MapManager(
        {
          default: { 1: "default-map-url" },
          "current-season": { 1: "season-map-url" },
        },
        vi.fn(),
        changeCustomStyle,
        removeCustomStyle,
        vi.fn().mockReturnValue("current-season"),
      );

      map.id = 1;
      module.applyCurrentMapChange();

      if (INTERFACE === "SI") {
        expect(changeCustomStyle).toHaveBeenCalledOnce();
        expect(removeCustomStyle).not.toHaveBeenCalled();
        expect(changeCustomStyle).toBeCalledWith(
          "map-background-image",
          `#ground {
              background-image: url(${resolveUrl("season-map-url")}) !important;
              background-color: transparent !important;
          }`.replaceAll(" ", ""),
        );
      }
    });

    it("should not change the map when there is a custom map but not in the current season", function () {
      const changeCustomStyle = vi.fn();
      const removeCustomStyle = vi.fn();
      const module = new MapManager(
        {
          default: {},
          "current-season": {},
          "other-season": { 1: "season-map-url" },
        },
        vi.fn(),
        changeCustomStyle,
        removeCustomStyle,
        vi.fn().mockReturnValue("current-season"),
      );

      map.id = 1;
      module.applyCurrentMapChange();

      if (INTERFACE === "SI") {
        expect(changeCustomStyle).not.toHaveBeenCalled();
        expect(removeCustomStyle).toHaveBeenCalled();
      }
    });

    it("should not change map when there is custom map but wrong id", function () {
      const changeCustomStyle = vi.fn();
      const removeCustomStyle = vi.fn();
      const module = new MapManager(
        {
          default: {},
          "current-season": { 2: "map-url" },
        },
        vi.fn(),
        changeCustomStyle,
        removeCustomStyle,
        vi.fn().mockReturnValue("current-season"),
      );

      map.id = 1;
      module.applyCurrentMapChange();

      if (INTERFACE === "SI") {
        expect(changeCustomStyle).not.toHaveBeenCalled();
        expect(removeCustomStyle).toHaveBeenCalledOnce();
        expect(removeCustomStyle).toBeCalledWith("map-background-image");
      }
    });
  });
});
