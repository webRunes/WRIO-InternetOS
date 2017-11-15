/**
 * Created by michbil on 19.07.17.
 */

import { extractFileName } from "./url";

test("should extract filename correctly", () => {
  expect(
    extractFileName("https://wr.io/1234567890/sillyfolder/sillyfile.htm")
  ).toEqual("sillyfolder/sillyfile.htm");
});
