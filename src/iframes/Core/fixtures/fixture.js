import fs from 'fs'
import path from 'path'

var file = fs.readFileSync(path.join(__dirname,'../fixtures/testjson.json')).toString();
var json = JSON.parse(file);

export default json;