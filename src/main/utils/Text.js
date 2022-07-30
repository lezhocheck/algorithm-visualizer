import UtilsError from "./UtilsError";
import BaseObject from "./BaseObject";
import Colors from "./Colors";

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
        if (!(colors instanceof Colors)) {
            throw new UtilsError(`Parameter 'colors' must be 'Colors'`);
        }
        this.#colors = colors;
        this.#horizontalAlign = 'center';
        this.#verticalAlign = 'middle';
        this.font = font;
        this.size = size;
    }

    set colors(value) {
        if (!(value instanceof Colors)) {
            throw new UtilsError(`Parameter 'colors' must be 'Colors'`);
        }
        this.#colors = value;
    }
    get colors() { return this.#colors; }

    get text() { return this.#text; }
    set text(value) {
        if (typeof value !== 'string') {
            throw new UtilsError(`Parameter 'text' must be 'string'`);
        }
        this.#text = value;
    }
    get horizontalAlign() { return this.#horizontalAlign; }
    set horizontalAlign(value) {
        if (typeof value !== 'string') {
            throw new UtilsError(`Parameter 'horizontalAlign' must be 'string'`);
        }
        this.#font = value;
    }
    get verticalAlign() { return this.#verticalAlign; }
    set verticalAlign(value) {
        if (typeof value !== 'string') {
            throw new UtilsError(`Parameter 'verticalAlign' must be 'string'`);
        }
        this.#font = value;
    }
    get font() { return this.#font; }
    set font(value) {
        if (typeof value !== 'string') {
            throw new UtilsError(`Parameter 'font' must be 'string'`);
        }
        this.#font = value;
    }

    get size() { return this.#size; }
    set size(value) {
        if (typeof value !== 'number') {
            throw new UtilsError(`Parameter 'size' must be 'number'`);
        }
        this.#size = value;
    }

    draw(context) {
        if (this.#colors.fill == null) {
            throw new UtilsError(`This text supports only fill`);
        }
        context.fillColor(this.#colors.fill);
        context.textAlign(this.horizontalAlign, this.verticalAlign);
        const size = context.convertToAdaptive(this.size);
        context.text(this.text, this.position, `${size}px ${this.font}`);
    }

}