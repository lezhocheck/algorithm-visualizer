import UtilsError from "./UtilsError";
import Validator from "../../Validator";

export default class Vector2 {

    #x;
    #y;

    constructor(x, y) {
        Validator.checkInstance(UtilsError, Number, {x: x}, {y: y});
        this.#x = x;
        this.#y = y;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    add(other, inPlace = false) {
        return this.#performOperation(other, (first, second) => first + second, inPlace);
    }

    subtract(other, inPlace = false) {
        return this.#performOperation(other, (first, second) => first - second, inPlace);
    }

    multiply(other, inPlace = false) {
        return this.#performOperation(other, (first, second) => first * second, inPlace);
    }

    divide(other, inPlace = false) {
        return this.#performOperation(other, (first, second) => first / second, inPlace);
    }

    static distance(first, other) {
        Validator.checkInstance(UtilsError, Vector2, {first: first}, {other: other});
        return Math.sqrt(Math.pow(other.#x - first.#x, 2) + Math.pow(other.#y - first.#y, 2));
    }

    get maxCoordinate() {
        return this.#x > this.#y ? this.#x : this.#y;
    }

    get minCoordinate() {
        return this.#x < this.#y ? this.#x : this.#y;
    }

    #performOperation(other, accumulator, inPlace) {
        const vector = this.#accumulate(other, accumulator);
        if (inPlace) {
            this.#x = vector.#x;
            this.#y = vector.#y;
            return;
        }
        return vector;
    }

    #accumulate(other, accumulator) {
        Validator.checkInstance(UtilsError, [Number, Vector2], {other: other});
        if (typeof other === 'number') {
            const x = accumulator(this.#x, other);
            const y = accumulator(this.#y, other);
            return new Vector2(x, y);
        } else if (other instanceof Vector2) {
            const x = accumulator(this.#x, other.#x);
            const y = accumulator(this.#y, other.#y);
            return new Vector2(x, y);
        }
    }

}