import UtilsError from "./UtilsError";
import Validator from "../../Validator";

export default class Colors {

    #stroke;
    #fill;

    constructor(stroke, fill) {
        this.stroke = stroke;
        this.fill = fill;
    }

    set fill(value) {
        Validator.checkInstance(UtilsError, [String, null], {value: value});
        this.#fill = value;
    }
    get fill() { return this.#fill; }

    set stroke(value) {
        Validator.checkInstance(UtilsError, [String, null], {value: value});
        this.#stroke = value;
    }
    get stroke() { return this.#stroke; }

}