/* @flow */
import LdJsonObject from './entities/LdJsonObject.js';

/* Loaded class, takes <scripts> from the document, parses them and applies mentions */

type LdJsonObjects = Array<LdJsonObject>;

function extractAuthorWrioID(author: string): string {
  const reg = /\?wr\.io=([0-9]*)$/gm;
  const regResult = reg.exec(author);
  const wrioID = regResult ? regResult[1] : !1;
  if (wrioID) {
    return wrioID;
  }
  throw new Error('Unable to extract author id');
}

function isNodeList(nodes: HTMLCollection<HTMLScriptElement> | Array<Object>): boolean {
  const stringRepr = Object.prototype.toString.call(nodes);

  return (
    typeof nodes === 'object' &&
    /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
    typeof nodes.length === 'number' &&
    (nodes.length === 0 || (typeof nodes[0] === 'object' && nodes[0].nodeType > 0))
  );
}

let id = 0;
class LdJsonDocument {
  blocks: LdJsonObjects;
  data: Array<Object>;
  id: number;

  constructor(scripts: HTMLCollection<HTMLScriptElement> | Array<Object>) {
    if (isNodeList(scripts)) {
      this.data = this.parseScripts(scripts);
    } else {
      this.data = scripts;
    }

    this.blocks = this.mapMentions(this.data);
    this.id = id++;
  }

  parseScripts(scripts: HTMLCollection<HTMLScriptElement>): Array<Object> {
    const data: Array<Object> = [];
    const scriptsArray: Array<HTMLElement> = [].slice.call(scripts); // to convert HtmlCollection to the Array, to address issues on the IE and mobile Safari
    for (const script of scripts) {
      if (script.type === 'application/ld+json') {
        let json;
        try {
          json = JSON.parse(script.textContent);
        } catch (exception) {
          json = undefined;
          console.error(`JSON-LD invalid: ${exception}`);
        }
        if (typeof json === 'object') {
          data.push(json);
        }
      }
    }
    return data;
  }

  mapMentions(data: Array<Object>): LdJsonObjects {
    return data.map(jsn => LdJsonObject.LdJsonFactory(jsn));
  }

  getBlocks(): LdJsonObjects {
    return this.blocks;
  }

  getProperty(field: string): ?string {
    let ret = null;
    this.blocks.forEach((section: LdJsonObject) => {
      console.log(section.data.author);
      const data = section.data[field];
      if (data !== undefined) {
        ret = data;
      }
    });
    return ret;
  }

  getAuthorWrioId() {
    const author = this.getProperty('author');
    try {
      if (author) {
        return extractAuthorWrioID(author);
      }
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  hasCommentId() {
    const comment = this.getProperty('comment');
    return comment !== null;
  }

  hasArticle(): boolean {
    return this.getArticle() !== null;
  }

  getArticle(): ?LdJsonObject {
    let r = null;
    this.blocks.forEach((e: LdJsonObject) => {
      if (e.getType() === 'Article') {
        r = true;
      }
    });
    return r;
  }

  /**
     * Returns LD+JSON entity of type <type>
     * @param type
     * @returns {*}
     */
  getElementOfType(type: string) {
    let rv;
    this.data.forEach((element) => {
      if (element['@type'] === type) {
        rv = element;
      }
    });
    return rv;
  }

  /**
     * Returns LD+JSON entity of type <type>
     * @param type
     * @returns {*}
     */
  setElementOfType(type: string, newElement: Object) {
    let found = false;
    this.data.forEach((element, i) => {
      if (element['@type'] === type) {
        found = true;
        this.data[i] = newElement;
        this.blocks[i] = LdJsonObject.LdJsonFactory(newElement);
      }
    });

    if (!found) {
      this.data.push(newElement);
      this.blocks.push(LdJsonObject.LdJsonFactory(newElement));
    }

  }

  getCommentID() {
    return this.getElementOfType('Article').comment;
  }
  setCommentID(cid) {
    this.getElementOfType('Article').comment = cid;
  }

  /**
     * sets current document description(about)
     * @param text - description text
     */

  setAbout(text) {
    const article = this.getElementOfType('Article');
    article.about = text;
  }
}

// this functions gets LD+JSON script array(got from html document) parses it and attaches mentions to the text
export default LdJsonDocument;
