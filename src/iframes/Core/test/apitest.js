const request= require('supertest');
const assert= require('assert');
const should= require('should');
const app= require('../src/index.js');

var ready = false;
app.ready = () => {
    ready = true;
};

var waitdb = () => {
    return new Promise((resolve, reject) => {
        setInterval(function() {
            if (ready) {
                console.log("App ready, starting tests");
                resolve();
                clearInterval(this);
            }
        }, 1000);
    });
};

describe("API unit tests", () => {

    before(async() => {
        await waitdb();
    });

    it("should return default page", (done) => {
        request(app)
            .get('/')
            .expect(200, done);
    });

    it("/create should return core.html page", (done) => {
        request(app)
            .get('/create')
            .expect(200, done);
    });

    it("/edit should return core.html page", (done) => {
        request(app)
            .get('/edit')
            .expect(200, done);
    });

    after(() => {

    });
});
