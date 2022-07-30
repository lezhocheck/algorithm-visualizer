import UtilsError from "./UtilsError";
import BaseObject from "./BaseObject";
import Vector2 from "./Vector2";

export default class Grid extends BaseObject {

    static #COLOR = '#cecece';

    #width;
    #height;
    #step;

    constructor(position, width, height, step) {
        super(position);
        this.#width = Grid.#validate(width);
        this.#height = Grid.#validate(height);
        this.#step = Grid.#validate(step);
    }

    static #validate(number) {
        if (typeof number !== 'number') {
            throw new UtilsError(`Argument must be a 'number'`);
        }
        return number;
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