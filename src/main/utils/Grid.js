import UtilsError from "./UtilsError";
import BaseObject from "./BaseObject";
import Vector2 from "./Vector2";
import Validator from "../../Validator";

export default class Grid extends BaseObject {

    static #COLOR = '#cecece';

    #width;
    #height;
    #step;

    constructor(position, width, height, step) {
        super(position);
        Validator.checkInstance(UtilsError, Number, {width: width}, {height: height}, {step: step});
        this.#width = width;
        this.#height = height;
        this.#step = step;
    }

    get center() { return this.position.add(new Vector2(this.#width / 2, this.#height / 2)); }

    draw(context) {
        context.strokeColor(Grid.#COLOR);
        context.lineWidth(1);
        context.beginPath();
        for (let x = 0; x <= this.#width; x += this.#step) {
            context.moveTo(new Vector2(this.position.x + x, this.position.y));
            context.lineTo(new Vector2(this.position.x + x, this.position.y + this.#height));
        }
        for (let y = 0; y <= this.#height; y += this.#step) {
            context.moveTo(new Vector2(this.position.x, this.position.y + y));
            context.lineTo(new Vector2(this.position.x + this.#width, this.position.y + y));
        }
        context.endPath();
        context.stroke();
    }

}