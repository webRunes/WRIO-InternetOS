/**
 * Created by michbil on 27.06.16.
 */

class AbstractMention {
    constructor (opts) {
        this.original = opts;
    }

    attach(obj) {
        console.warn("Not implemented");
    }

    render() {
        console.warn("Not implemented");
    }

}
export default AbstractMention;