import request from "superagent";

export function getEthereumId() {
  return new Promise((resolve, reject) => {
    request
      .get("/api/webgold/get_wallet")
      .set("X-Requested-With", "XMLHttpRequest")
      .withCredentials()
      .end((err, res) => {
        if (err) {
          return reject(res);
        }
        resolve(res.text);
      });
  });
}

export function saveEthereumId(id) {
  return new Promise((resolve, reject) => {
    request
      .post(`/api/webgold/save_wallet?wallet=${id}`)
      .set("X-Requested-With", "XMLHttpRequest")
      .withCredentials()
      .end((err, res) => {
        if (err) {
          return reject(res);
        }
        resolve(res);
      });
  });
}

export function sendSignedTransaction(tx, id) {
  return new Promise((resolve, reject) => {
    request
      .get(`/api/webgold/signtx?tx=${tx}&id=${id}`)
      .set("X-Requested-With", "XMLHttpRequest")
      .withCredentials()
      .end((err, res) => (err ? reject(err) : resolve(res)));
  });
}
