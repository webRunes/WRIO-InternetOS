import request from "supertest";
import assert from "assert";
import should from "should";
import Mention from "./mention.js";
import ImageObject from "./image.js";

describe("mention test", () => {
  it("Shoud determine correct mention start and order", () => {
    var mention = new Mention({
      "@type": "Article",
      name: "First url title",
      about: "Text inside the ticket popup.",
      url: "https://webrunes.com/blog.htm?'dolor sit amet':3,104"
    });
    mention.start.should.be.equal(104);
    mention.order.should.be.equal(3);
  });

  it("Shoud determine correct mention start and order for ImageObject", () => {
    var mention = new ImageObject({
      "@type": "ImageObject",
      name: "Object",
      about: "Object about",
      contentUrl: "https://pbs.twimg.com/media/CTfm_JRWsAEPBfq.jpg?3,0"
    });
    mention.start.should.be.equal(0);
    mention.order.should.be.equal(3);
  });
});
