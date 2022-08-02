import UtilsError from "./UtilsError";
import BaseObject from "./BaseObject";
import Colors from "./Colors";
import Validator from "../../Validator";

export default class Circle extends BaseObject {

    #radius;
    #colors;

    constructor(position, radius, colors) {
        super(position);
        this.colors = colors;
        this.radius = radius;
    }

    get colors() { return this.#colors; }
    set colors(value) {
        Validator.checkInstance(UtilsError, Colors, {colors: value});
        this.#colors = value;
    }

    set radius(value) {
        Validator.checkInstance(UtilsError, Number, {radius: value});
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