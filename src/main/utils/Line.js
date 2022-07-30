import Vector2 from "./Vector2";
import UtilsError from "./UtilsError";
import Colors from "./Colors";
import BaseObject from "./BaseObject";

export default class Line extends BaseObject {

    #end;
    #colors;
    #width;

    constructor(start, end, colors, width = 1) {
        super(start);
        if (!(end instanceof Vector2)) {
            throw new UtilsError(`Invalid type. Expected 'Vector2' for the 'end' parameter`);
        }
        this.#end = end;
        this.colors = colors;
        this.width = width;
    }

    set colors(value) {
        if (!(value instanceof Colors)) {
            throw new UtilsError(`Parameter 'colors' must be 'Colors'`);
        }
        this.#colors = value;
    }
    get colors() { return this.#colors; }

    get end() { return this.#end; }
    get width() { return this.#width; }
    set width(value) {
        if (typeof value !== 'number') {
            throw new UtilsError(`Parameter 'width' must be 'number'`);
        }
        this.#width = value;
    }

    get length() { return Vector2.distance(this.position, this.#end); }

   draw(context) {
       if (this.#colors.stroke == null) {
           throw new UtilsError(`This line supports only stroke`);
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