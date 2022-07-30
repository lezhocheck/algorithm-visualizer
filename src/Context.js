import ComponentError from "./ComponentError";
import BaseObjectContainer from "./main/utils/BaseObjectContainer";
import Vector2 from "./main/utils/Vector2";
import Transformation from "./main/utils/transformation/Transformation";

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
        if (Context.#ALLOWED.find(element => context instanceof element) == null) {
            throw new ComponentError(`Invalid context '${context}'`);
        }
        if (typeof adaptive !== 'boolean') {
            throw new ComponentError(`Invalid type of 'adaptive' parameter. Expected 'boolean'`);
        }
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
        if (typeof horizontal !== 'string' || typeof vertical !== 'string') {
            throw new ComponentError(`Invalid type of parameters. Expected 'string' for both arguments`);
        }
        this.#context.textAlign = horizontal;
        this.#context.textBaseline = vertical;
    }

    moveTo(position) {
        if (!(position instanceof Vector2)) {
            throw new ComponentError(`Invalid type of 'position' parameter. Expected 'Vector2'`);
        }
        this.#context.moveTo(position.x, position.y);
    }

    lineTo(position) {
        if (!(position instanceof Vector2)) {
            throw new ComponentError(`Invalid type of 'position' parameter. Expected 'Vector2'`);
        }
        this.#context.lineTo(position.x, position.y);
    }

    lineWidth(value) {
        if (typeof value !== 'number') {
            throw new ComponentError(`Invalid type of parameter. Expected 'number'`);
        }
        this.#context.lineWidth = value;
    }

    arc(position, radius, start = 0, end = 2 * Math.PI, clockwise = false) {
        if (!(position instanceof Vector2)) {
            throw new ComponentError(`Invalid type of 'position' parameter. Expected 'Vector2'`);
        }
        if (typeof radius !== 'number' || typeof start !== 'number' || typeof end !== 'number') {
            throw new ComponentError(`Invalid type of parameter. Expected 'number'`);
        }
        if (typeof clockwise !== 'boolean') {
            throw new ComponentError(`Invalid type of parameter. Expected 'boolean'`);
        }
        this.#context.arc(position.x, position.y, radius, start, end, !clockwise);
    }

    strokeColor(color) {
        if (typeof color !== 'string') {
            throw new ComponentError(`Invalid type of 'color' parameter. Expected 'string'`);
        }
        this.#context.strokeStyle = color;
    }

    fillColor(color) {
        if (typeof color !== 'string') {
            throw new ComponentError(`Invalid type of 'color' parameter. Expected 'string'`);
        }
        this.#context.fillStyle = color;
    }

    stroke() { this.#context.stroke(); }
    fill() { this.#context.fill(); }

    text(text, position, font) {
        if (typeof text !== 'string' || typeof font !== 'string') {
            throw new ComponentError(`Invalid type of parameter. Expected 'string'`);
        }
        if (!(position instanceof Vector2)) {
            throw new ComponentError(`Invalid type of 'position' parameter. Expected 'Vector2'`);
        }
        this.#context.font = font;
        this.#context.fillText(text, position.x, position.y);
    }

    #processObject(object) {
        if (this.#transformation != null) {
            // TODO rotation
            this.#context.setTransform(this.#transformation.scale.x, 0, 0, this.#transformation.scale.y,
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
        const delta = Context.#SCALE_VALUE / this.#transformation.scale.minCoordinate;
        if (value instanceof Vector2) {
            return value.multiply(delta);
        } else if (typeof value === 'number') {
            return value * delta;
        } else {
            throw new ComponentError(`Unknown value type '${typeof value}'`);
        }
    }

    draw(transformation = null) {
        if (!(transformation instanceof Transformation) && transformation != null) {
            throw new ComponentError(`Invalid type of 'transformation' parameter. Expected 'Transformation'`);
        }
        this.#transformation = transformation;
        this.#baseObjectContainer.forEach(value => {
            this.#processObject(value);
        });
    }

}