import Vector2 from "./Vector2";
import UtilsError from "./UtilsError";
import Colors from "./Colors";
import BaseObject from "./BaseObject";
import Validator from "../../Validator";

export default class Line extends BaseObject {

    #end;
    #colors;
    #width;

    constructor(start, end, colors, width = 1) {
        super(start);
        Validator.checkInstance(UtilsError, Vector2, {end: end});
        this.#end = end;
        this.colors = colors;
        this.width = width;
    }

    set colors(value) {
        Validator.checkInstance(UtilsError, Colors, {value: value});
        this.#colors = value;
    }
    get colors() { return this.#colors; }

    get end() { return this.#end; }
    get width() { return this.#width; }
    set width(value) {
        Validator.checkInstance(UtilsError, Number, {value: value});
        this.#width = value;
    }

    get length() { return Vector2.distance(this.position, this.#end); }

   draw(context) {
       if (this.#colors.stroke == null) {
           throw new UtilsError(`The 'Line' object supports stroke only`);
       }
       context.strokeColor(this.#colors.stroke);
       context.lineWidth(context.convertToAdaptive(this.width));
       context.beginPath();
       context.moveTo(this.position);
       context.lineTo(this.#end);
       context.endPath();
       context.stroke();
   }

}