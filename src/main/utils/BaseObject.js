import NotImplementedError from "./NotImplementedError";
import Vector2 from "./Vector2";
import UtilsError from "./UtilsError";

export default class BaseObject {

    #position;

    constructor(position) {
        this.position = position;
    }

    get position() { return this.#position; }
    set position(value) {
        if (!(value instanceof Vector2)) {
            throw new UtilsError(`Parameter 'position' must be 'Vector2'`);
        }
        this.#position = value;
    }

    move(offset) {
        if (!(offset instanceof Vector2)) {
            throw new UtilsError(`Parameter 'offset' must be 'Vector2'`);
        }
        this.#position.add(offset, true);
    }

    draw(context) {
        throw new NotImplementedError();
    }

}
