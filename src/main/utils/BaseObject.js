import NotImplementedError from "./NotImplementedError";
import Vector2 from "./Vector2";
import UtilsError from "./UtilsError";
import Validator from "../../Validator";

export default class BaseObject {

    #position;

    constructor(position) {
        this.position = position;
    }

    get position() { return this.#position; }
    set position(value) {
        Validator.checkInstance(UtilsError, Vector2, {position: value});
        this.#position = value;
    }

    move(offset) {
        Validator.checkInstance(UtilsError, Vector2, {offset: offset});
        this.#position.add(offset, true);
    }

    draw(context) {
        throw new NotImplementedError();
    }

}
