import UtilsError from "./UtilsError";
import BaseObject from "./BaseObject";
import Colors from "./Colors";

export default class Circle extends BaseObject {

    #radius;
    #colors;

    constructor(position, radius, colors) {
        super(position);
        if (!(colors instanceof Colors)) {
            throw new UtilsError(`Parameter 'colors' must be 'Colors'`);
        }
        this.#colors = colors;
        this.radius = radius;
    }

    get colors() { return this.#colors; }
    set colors(value) {
        if (!(value instanceof Colors)) {
            throw new UtilsError(`Parameter 'colors' must be 'Colors'`);
        }
        this.#colors = value;
    }

    set radius(value) {
        if (typeof value !== 'number') {
            throw new UtilsError(`Parameter 'radius' must be 'number'`);
        }
        this.#radius = value;
    }
    get radius() { return this.#radius; }

    draw(context) {
        if (this.#colors.fill != null) {
            context.fillColor(this.#colors.fill);
        }
        if (this.#colors.stroke != null) {
            context.strokeColor(this.#colors.stroke);
        }
        context.beginPath();
        context.arc(this.position, context.convertToAdaptive(this.radius), 0, 2 * Math.PI);
        context.endPath();
        if (this.#colors.fill != null) {
            context.fill();
        }
        if (this.#colors.stroke != null) {
            context.stroke();
        }
    }

}