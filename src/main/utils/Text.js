import UtilsError from "./UtilsError";
import BaseObject from "./BaseObject";
import Colors from "./Colors";
import Validator from "../../Validator";

export default class Text extends BaseObject {

    #text;
    #colors;
    #horizontalAlign;
    #verticalAlign;
    #font;
    #size;

    constructor(position, text, colors, font = 'serif', size = 36) {
        super(position);
        this.text = text;
        this.colors = colors;
        this.#horizontalAlign = 'center';
        this.#verticalAlign = 'middle';
        this.font = font;
        this.size = size;
    }

    set colors(value) {
        Validator.checkInstance(UtilsError, Colors, {value: value});
        this.#colors = value;
    }
    get colors() { return this.#colors; }

    get text() { return this.#text; }
    set text(value) {
        Validator.checkInstance(UtilsError, String, {value: value});
        this.#text = value;
    }

    get horizontalAlign() { return this.#horizontalAlign; }
    get verticalAlign() { return this.#verticalAlign; }

    get font() { return this.#font; }
    set font(value) {
        Validator.checkInstance(UtilsError, String, {value: value});
        this.#font = value;
    }

    get size() { return this.#size; }
    set size(value) {
        Validator.checkInstance(UtilsError, Number, {value: value});
        this.#size = value;
    }

    draw(context) {
        if (this.#colors.fill == null) {
            throw new UtilsError(`The 'Text' object supports fill only`);
        }
        context.fillColor(this.#colors.fill);
        context.textAlign(this.horizontalAlign, this.verticalAlign);
        const size = context.convertToAdaptive(this.size);
        context.text(this.text, this.position, `${size}px ${this.font}`);
    }

}