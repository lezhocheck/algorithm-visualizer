import Vector2 from "./Vector2";
import UtilsError from "./UtilsError";
import Colors from "./Colors";
import BaseObject from "./BaseObject";

export default class Rect extends BaseObject {

    #size;
    #colors;

    constructor(position, width, height, colors = null) {
        super(position);
        this.#size = new Vector2(width, height);
        if (!(colors instanceof Colors) && colors != null) {
            throw new UtilsError(`Parameter 'colors' must be 'Colors'`);
        }
        if (width <= 0 || height <= 0) {
            throw new UtilsError(`Sizes must be greater than 0`);
        }
        this.#colors = colors;
    }

    get size() { return this.#size; }
    get colors() { return this.#colors; }
    get center() { return this.position.add(this.size.divide(2)); }
    get upperBound() { return this.position.add(this.size); }

    draw(context) {
        if (this.#colors.fill != null) {
            context.fillColor(this.#colors.fill);
        }
        if (this.#colors.stroke != null) {
            context.strokeColor(this.#colors.stroke);
        }
        context.beginPath();
        context.moveTo(this.position.x, this.position.y);
        context.lineTo(this.position.x, this.upperBound.y);
        context.lineTo(this.upperBound.x, this.upperBound.y);
        context.lineTo(this.upperBound.x, this.position.y);
        context.endPath();
        if (this.#colors.fill != null) {
            context.fill();
        }
        if (this.#colors.stroke != null) {
            context.stroke();
        }
    }

}

