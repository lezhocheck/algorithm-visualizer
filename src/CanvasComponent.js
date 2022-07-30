import EventComponent from "./EventComponent";
import ComponentError from "./ComponentError";
import Vector2 from "./main/utils/Vector2";
import Context from "./Context";

export default class CanvasComponent extends EventComponent {

    #context;
    #componentContext;

    static #DEFAULT_WIDTH = 600;
    static #DEFAULT_HEIGHT = 400;

    constructor(properties) {
        if (!properties.hasOwnProperty('eventHandlers')) {
            throw new ComponentError(`An array 'eventHandlers' expected`);
        }
        const startHandlerObject = properties.eventHandlers.find(x => x.name === 'start');
        const drawHandlerObject = properties.eventHandlers.find(x => x.name === 'draw');
        if (startHandlerObject == null || drawHandlerObject == null) {
            throw new ComponentError(`Event handlers 'start' and 'draw' expected`);
        }
        if (properties.hasOwnProperty('attributes') &&
            properties.attributes.hasOwnProperty('style')) {
            if (properties.attributes.style.includes('width') ||
                properties.attributes.style.includes('height')) {
                throw new ComponentError(`Do not use 'style: width and height' on the 'CanvasComponent'. ` +
                 `Use 'size: { width: ..., height: ... } instead`);
            }
        }

        let width = CanvasComponent.#DEFAULT_WIDTH;
        let height = CanvasComponent.#DEFAULT_HEIGHT;

        if (properties.hasOwnProperty('size')) {
            if (properties.size.hasOwnProperty('width')) {
                width = properties.size.width;
            }
            if (properties.size.hasOwnProperty('height')) {
                height = properties.size.height;
            }
        }

        super('canvas', {...properties, eventHandlers: []});

        const contextType = properties.hasOwnProperty('context') ? properties['context'] : '2d';
        this.#context = this._domElement.getContext(contextType);
        this.#context.canvas.width = width;
        this.#context.canvas.height = height;

        if (!properties.hasOwnProperty('adaptive')) {
            throw new ComponentError(`Expected 'adaptive' property`);
        }
        this.#componentContext = new Context(this.#context, properties.adaptive);

        this.#requestAnimationFrame(startHandlerObject.handler, this.#componentContext);
        this.#requestAnimationFrame(drawHandlerObject.handler, this.#componentContext, true);


        const filtered = properties.eventHandlers.filter(x => x.name !== 'start' && x.name !== 'draw');
        this.#processHandler(filtered, 'mousemove', (event) => {
            const boundRect = this.#context.canvas.getBoundingClientRect();
            const offset = new Vector2(boundRect.left, boundRect.top);
            const scale = new Vector2(width / boundRect.width, height / boundRect.height);
            return new Vector2(event.clientX, event.clientY).subtract(offset).multiply(scale);
        });
        this.#processHandler(filtered, 'mousedown', (event) => {
            return event;
        });

        // Using global event for 'mouseup'
        window.addEventListener('mouseup', (event) => {
            const handlerObject = properties.eventHandlers.find(x => x.name === 'mouseup');
            handlerObject.handler(event);
        });

        this.#processHandler(filtered, 'wheel', (event) => {
            return event.deltaY;
        });

        if (properties.hasOwnProperty('cursor')) {
            this.#context.canvas.style.cursor = properties.cursor;
        }
    }


    #processHandler(handlersArray, name, eventMapFunction) {
        const handlerObject = handlersArray.find(x => x.name === name);
        if (handlerObject != null) {
            this.addEventHandler({name: handlerObject.name, handler: (event) => {
                handlerObject.handler(eventMapFunction(event));
            }});
        }
    }

    #requestAnimationFrame(func, param, repeat = false) {
        const obj = this;
        func(param);
        if (repeat) {
            window.requestAnimationFrame(function() {
                obj.#requestAnimationFrame(func, param, repeat);
            });
        }
    }

}


