import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildGoogleMapsSearchUrl, buildGoogleMapsRouteUrl } from "../js/map.js";

describe("Map Module Tests", () => {
  test("buildGoogleMapsSearchUrl constructs valid query URL", () => {
    const url = buildGoogleMapsSearchUrl("restaurants near Sapthagiri NPS University");
    assert.equal(url.includes("https://www.google.com/maps/search/?api=1"), true);
    assert.equal(url.includes("query=restaurants"), true);
  });

  test("buildGoogleMapsRouteUrl constructs valid directions URL", () => {
    const url = buildGoogleMapsRouteUrl("Majestic Bus Stand", "transit");
    assert.equal(url.includes("https://www.google.com/maps/dir/?api=1"), true);
    assert.equal(url.includes("destination=Majestic+Bus+Stand"), true);
    assert.equal(url.includes("travelmode=transit"), true);
  });
});
