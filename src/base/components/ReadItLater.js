import React from "react";
import UrlMixin from "../mixins/UrlMixin";
import { getResourcePath } from "../global";
import Thumbnail from "./misc/ListThumbnail";

const ItemListElement = ({ name, about, image, url }) => {
  const itemImage = image || getResourcePath("/img/no-photo-200x200.png");
  return (
    <a href={UrlMixin.fixUrlProtocol(url)}>
      <article>
        <div className="media thumbnail clearfix">
          <header className="col-xs-12">
            <h2>{name}</h2>
          </header>
          <div className="col-xs-12 col-md-3 pull-right">
            <Thumbnail image={itemImage} />
            <ul className="details">
              <li>Access: Free</li>
            </ul>
          </div>

          <div className="col-xs-12 col-md-9">
            <p>{about}</p>
          </div>
        </div>
      </article>
    </a>
  );
};

const ReadItLater = ({ RIL }) => {
  if (!RIL) {
    return <img src="https://default.wrioos.com/img/loading.gif" />;
  }
  const tabs = RIL;
  return (
    <div>
      {tabs.map((t, i) => {
        return <ItemListElement key={i} name={t.name} about="" url={t.url} />;
      })}
    </div>
  );
};

export default ReadItLater;
