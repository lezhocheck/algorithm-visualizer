import UtilsError from "./UtilsError";

export default class Vector2 {

    #x;
    #y;

    static Min = new Vector2(Number.MIN_VALUE, Number.MIN_VALUE);
    static Max = new Vector2(Number.MAX_VALUE, Number.MAX_VALUE);
    static Zero = new Vector2(0, 0);
    static One = new Vector2(1, 1);
    static Up = new Vector2(0, 1);
    static Down = new Vector2(0, -1);
    static Left = new Vector2(-1, 0);
    static Right = new Vector2(1, 0);

    constructor(x, y) {
        Vector2.#validate(x, y);
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

    get magnitude() {
        return Math.sqrt(this.#x * this.#x + this.#y * this.#y);
    }

    get normalized() {
        return this.divide(this.magnitude);
    }

    static distance(first, other) {
        if (!(first instanceof Vector2) || !(other instanceof Vector2)) {
            throw new UtilsError(`Unknown type. Expected 'Vector2' for both parameters`);
        }
        return Math.sqrt(Math.pow(other.#x - first.#x, 2) + Math.pow(other.#y - first.#y, 2));
    }

    get maxCoordinate() {
        return this.#x > this.#y ? this.#x : this.#y;
    }

    get minCoordinate() {
        return this.#x < this.#y ? this.#x : this.#y;
    }

    static min(first, second) {
        if (!(first instanceof Vector2) || !(second instanceof Vector2)) {
            throw new UtilsError(`Arguments must be 'Vector2' type`);
        }
        if (first.#x === second.#x) {
            return first.#y < second.#y ? first : second;
        }
        return first.#x < second.#x ? first : second;
    }

    static max(first, second) {
        if (!(first instanceof Vector2) || !(second instanceof Vector2)) {
            throw new UtilsError(`Arguments must be 'Vector2' type`);
        }
        if (first.#x === second.#x) {
            return first.#y > second.#y ? first : second;
        }
        return first.#x > second.#x ? first : second;
    }

    #performOperation(other, accumulator, inPlace) {
        const vector = this.#accumulate(other, accumulator);
        if (inPlace) {
            this.#x = vector.#x;
            this.#y = vector.#y;
            return undefined;
        }
        return vector;
    }

    #accumulate(other, accumulator) {
        if (typeof other === 'number') {
            const x = accumulator(this.#x, other);
            const y = accumulator(this.#y, other);
            return new Vector2(x, y);
        } else if (other instanceof Vector2) {
            const x = accumulator(this.#x, other.#x);
            const y = accumulator(this.#y, other.#y);
            return new Vector2(x, y);
        } else {
            throw new UtilsError(`Wrong type '${typeof other}'. Must be 'number' or 'Vector2'`)
        }
    }

    static #validate(x, y) {
        if (typeof x != 'number' || typeof y != 'number') {
            throw new UtilsError(`Parameters 'x' and 'y' must be numbers`);
        }
    }

}