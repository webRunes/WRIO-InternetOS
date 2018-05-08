/**
 * Created by michbil on 15.01.16.
 */

import assert from "assert";
import should from "should";
import normURL, { getPlusUrl, isPlusUrl } from "./normURL.js";

describe("URL normalizer test", () => {
  it("Should normalize URLs correctly", () => {
    var url = "https://wrioos.com/index.htm";
    var normalized = normURL(url);
    should(normalized).equal("https://wrioos.com");
    should(normURL("https://wr.io/474365383130/Untitled")).equal(
      "https://wr.io/474365383130/Untitled"
    );
  });

  it("Should recognize plus url correctly", () => {
    var testurl = "https://wr.io/558153389649/Plus-WRIO-App/#";
    should(isPlusUrl(testurl, "558153389649")).equal(true);
    should(isPlusUrl("https://login.wrrios.com/#", "558153389649")).equal(
      false
    );
  });
});
