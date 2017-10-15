/**
 * Created by michbil on 18.07.17.
 */
import {
  HEADER_CHANGED,
  FILENAME_CHANGED,
  PUBLISH_DOCUMENT,
  PUBLISH_FINISH,
  filenameChanged,
  descChanged,
  gotUrlParams
} from "../actions/publishActions";

import { receiveUserData } from "../actions/indexActions";
import { getSaveUrl } from "./publish";

test("should export save url for given wrioID and path", () => {
  expect(getSaveUrl("1234567890", "sillyfolder/sillyfile.html")).toEqual(
    "https://wr.io/1234567890/sillyfolder/sillyfile.html"
  );
});

test("should create new document correctly", () => {
  const reducer = require("./publish").default;
  const s1 = reducer(undefined, gotUrlParams(true));
  const s2 = reducer(s1, receiveUserData({ wrioID: "1234567800" }));
  const s3 = reducer(s2, filenameChanged("Hello"));
  console.log(s3);
  expect(s3.savePath).toEqual("Hello/index.html");
  expect(s3.saveUrl).toEqual("https://wr.io/1234567800/Hello/index.html");

  //const s4 = reducer(s3,)
});

test("should edit existing document correctly", () => {
  const reducer = require("./publish").default;
  const s1 = reducer(
    undefined,
    gotUrlParams(
      false,
      "https://wr.io/1234567800/Hello/index.html",
      "Hello/index.html"
    )
  );
  const s2 = reducer(s1, receiveUserData({ wrioID: "1234567800" }));
  const s3 = reducer(s2, filenameChanged("Second"));
  console.log(s3);
  expect(s3.savePath).toEqual("Hello/index.html");
  expect(s3.saveUrl).toEqual("https://wr.io/1234567800/Hello/index.html");

  //const s4 = reducer(s3,)
});
