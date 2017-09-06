import fs from 'fs'
import path from 'path'

const getFixture = (fixturename : string) : Object => {
    var file = fs.readFileSync(path.join(__dirname,`../fixtures/${fixturename}.json`)).toString();
    return  JSON.parse(file);
}

export default getFixture;

