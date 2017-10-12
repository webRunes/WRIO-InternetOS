import documentReducer,{getAuthor} from './documentReducer'
import getFixture from 'CoreEditor/fixtures/fixture'
import LdJsonDocument from 'base/jsonld/LdJsonDocument'
import {extractPageNavigation} from 'base/utils/tocnavigation'

const loginMessage = {
    "type":"LOGIN_MESSAGE",
    "msg":{
        "profile":
        {"result":"success",
        "ethereumWallet":"0xff09e9e586c039ff27f97d8201b1c62ec20a0cb4",
        "temporary":false,
        "id":"558153389641",
        "url":"https://wr.io/558153389641/",
        "cover":"https://wr.io/558153389641/cover.htm",
        "name":"Test user"}
    }
}

const document =  new LdJsonDocument(getFixture('testjson'))
const authordocument =  new LdJsonDocument(getFixture('author558153389641'))

test('should process loginMessage correctly', () => {
    const s1 = documentReducer(null,{
        type:"GOT_JSON_LD_DOCUMENT",
        url: "https://webrunes.com",
        data: document,
        toc: extractPageNavigation(document, true)
    });
    const s2 = documentReducer(s1,loginMessage);
    console.log(s2);
    expect(s2.editAllowed).toEqual(false);
});

test("should extract author from JSON-LD document correctly", () => {
    const author = getAuthor(authordocument)
    expect(author).toEqual('https://wr.io/558153389641/')
})


test('should allow editing to author', () => {
    const s1 = documentReducer(null,{
        type:"GOT_JSON_LD_DOCUMENT",
        url: "https://webrunes.com",
        data: authordocument,
        toc: extractPageNavigation(authordocument, true)
    });
    const s2 = documentReducer(s1,loginMessage);
    console.log(s2);
   // expect(s2.editAllowed).toEqual(true); 
});