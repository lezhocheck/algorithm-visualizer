import UtilsError from "./UtilsError";

export default class Colors {

    #stroke;
    #fill;

    constructor(stroke, fill) {
        this.stroke = stroke;
        this.fill = fill;
    }

    set fill(value) {
        if (typeof value !== 'string' && value != null) {
            throw new UtilsError(`Parameter 'fill' must be 'string'`);
        }
        this.#fill = value;
    }
    get fill() { return this.#fill; }

    set stroke(value) {
        if (typeof value !== 'string' && value != null) {
            throw new UtilsError(`Parameter 'stroke' must be 'string'`);
        }
        this.#stroke = value;
    }
    get stroke() { return this.#stroke; }

}