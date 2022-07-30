import UtilsError from "../UtilsError";
import Vector2 from "../Vector2";

export default class Transformation {

    #translation;
    #scale;
    #rotation;

    constructor(translation, scale = 1, rotation = 0) {
        this.translation = translation;
        this.scale = scale;
        this.rotation = rotation;
    }

    get translation() { return this.#translation; }
    set translation(value) {
        if (!(value instanceof Vector2)) {
            throw new UtilsError(`Unknown type '${typeof value}'. Expected 'Vector2'`);
        }
        this.#translation = value;
    }

    get scale() {
        if (typeof this.#scale === 'number') {
            return new Vector2(this.#scale, this.#scale);
        }
        return this.#scale;
    }
    set scale(value) {
        if (!(value instanceof Vector2) && typeof value !== 'number') {
            throw new UtilsError(`Unknown type '${typeof value}'. Expected 'Vector2' or 'number'`);
        }
        this.#scale = value;
    }

    get rotation() { return this.#rotation * Math.PI / 180; }
    set rotation(value) {
        if (typeof value !== 'number') {
            throw new UtilsError(`Unknown type '${value}'. Expected 'number'`);
        }
        this.#rotation = value;
    }

}