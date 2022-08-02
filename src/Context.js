import ComponentError from "./ComponentError";
import BaseObjectContainer from "./main/utils/BaseObjectContainer";
import Vector2 from "./main/utils/Vector2";
import Validator from "./Validator";
import BaseObject from "./main/utils/BaseObject";

export default class Context {

    static #ALLOWED = [
        CanvasRenderingContext2D,
        WebGLRenderingContext,
        WebGL2RenderingContext,
        ImageBitmapRenderingContext
    ];

    static #SCALE_VALUE = 0.8;

    #context;
    #baseObjectContainer;

    #transformation;
    #adaptive;

    constructor(context, adaptive = false) {
        Validator.checkInstance(ComponentError, Context.#ALLOWED, {context: context});
        Validator.checkInstance(ComponentError, Boolean, {adaptive: adaptive});
        this.#adaptive = adaptive;
        this.#context = context;
        this.#baseObjectContainer = new BaseObjectContainer();
    }

    get baseObjectContainer() {
        return this.#baseObjectContainer;
    }

    clearAll() {
        this.#context.clearRect(0, 0, this.#context.canvas.width, this.#context.canvas.height);
    }

    beginPath() { this.#context.beginPath(); }
    endPath() { this.#context.closePath(); }

    textAlign(horizontal, vertical) {
        Validator.checkInstance(ComponentError, String, {horizontal: horizontal}, {vertical: vertical});
        this.#context.textAlign = horizontal;
        this.#context.textBaseline = vertical;
    }

    moveTo(position) {
        Validator.checkInstance(ComponentError, Vector2, {position: position});
        this.#context.moveTo(position.x, position.y);
    }

    lineTo(position) {
        Validator.checkInstance(ComponentError, Vector2, {position: position});
        this.#context.lineTo(position.x, position.y);
    }

    lineWidth(value) {
        Validator.checkInstance(ComponentError, Number, {value: value});
        this.#context.lineWidth = value;
    }

    arc(position, radius, start = 0, end = 2 * Math.PI, clockwise = false) {
        Validator.checkInstance(ComponentError, Vector2, {position: position});
        Validator.checkInstance(ComponentError, Number, {radius: radius}, {start: start}, {end: end});
        Validator.checkInstance(ComponentError, Boolean, {clockwise: clockwise});
        this.#context.arc(position.x, position.y, radius, start, end, !clockwise);
    }

    strokeColor(color) {
        Validator.checkInstance(ComponentError, String, {color: color});
        this.#context.strokeStyle = color;
    }

    fillColor(color) {
        Validator.checkInstance(ComponentError, String, {color: color});
        this.#context.fillStyle = color;
    }

    stroke() { this.#context.stroke(); }
    fill() { this.#context.fill(); }

    text(text, position, font) {
        Validator.checkInstance(ComponentError, String, {text: text}, {font: font});
        Validator.checkInstance(ComponentError, Vector2, {position: position});
        this.#context.font = font;
        this.#context.fillText(text, position.x, position.y);
    }

    #processObject(object) {
        Validator.checkInstance(ComponentError, BaseObject, {object: object});
        if (this.#transformation != null) {
            this.#context.setTransform(this.#transformation.scale, 0, 0, this.#transformation.scale,
                this.#transformation.translation.x, this.#transformation.translation.y);
        }

        object.draw(this);

        if (this.#transformation != null) {
            this.#context.setTransform(1, 0, 0, 1, 0, 0);
        }
    }

    add(baseObject) { this.#baseObjectContainer.add(baseObject); }

    convertToAdaptive(value) {
        if (!this.#adaptive) {
            throw new ComponentError(`Context must be adaptive to use this conversion`);
        }
        if (this.#transformation == null) {
            throw new ComponentError(`Context must be transformable for an adaptive conversion`);
        }
        const delta = Context.#SCALE_VALUE / this.#transformation.scale;
        Validator.checkInstance(ComponentError, [Vector2, Number], {value: value});

        if (value instanceof Vector2) {
            return value.multiply(delta);
        } else if (typeof value === 'number') {
            return value * delta;
        }
    }

    draw(translation, scale) {
        Validator.checkInstance(ComponentError, Vector2, {translation: translation});
        Validator.checkInstance(ComponentError, Number, {scale: scale});
        this.#transformation = {translation: translation, scale: scale};
        this.#baseObjectContainer.forEach(value => {
            this.#processObject(value);
        });
    }

}