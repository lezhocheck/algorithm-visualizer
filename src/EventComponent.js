import ComponentError from "./ComponentError";
import Component from "./Component";

export default class EventComponent extends Component {

    #eventHandlers;

    constructor(type, properties) {
        if (properties == null || !properties.hasOwnProperty('eventHandlers')) {
            throw new ComponentError(`Component must receive an array with valid event handlers`);
        }

        super(type, properties);

        this.#eventHandlers = [];

        if (Array.isArray(properties.eventHandlers)) {
            for (let eventHandler in properties.eventHandlers) {
                this.#process_handler(properties.eventHandlers[eventHandler]);
            }
        } else if (typeof properties.eventHandlers === 'object') {
            this.#process_handler(properties.eventHandlers);
        } else {
            throw new ComponentError(`Unknown type of  the 'eventHandlers' object`);
        }
    }

    addEventHandler(eventHandler) {
        this.#process_handler(eventHandler);
    }

    removeEventHandler(eventHandlerName) {
        const index = this.#eventHandlers.findIndex(item => item['name'] === eventHandlerName);
        if (index === -1) {
            throw new ComponentError(`Component does not have handler '${eventHandlerName}' attached`);
        }
        const element = this.#eventHandlers[index];
        this._domElement.removeEventListener(element['name'], element['handler'], element['options']);
        this.#eventHandlers.splice(index, 1);
    }

    #process_handler(handler) {
        const valid = EventComponent.#validHandler(handler);
        const element = this.#eventHandlers.find(item => item['name'] === valid['name']);
        if (element != null) {
            throw new ComponentError(`Component already has this event handler '${valid['name']}'`);
        }

        this.#eventHandlers.push(valid);
        this._domElement.addEventListener(valid['name'], valid['handler'], valid['options']);
    }

    // handler must be an object with 'name', 'function' and 'options' properties
    // 'options' can be null
    static #validHandler(handler) {
        if (handler == null || !handler.hasOwnProperty('name') || !handler.hasOwnProperty('handler')) {
            throw new ComponentError(`Handler must be an object with 'name', 'handler' and` +
                `'options' properties ('options' can be null')`);
        }

        if (!handler.hasOwnProperty('options')) {
            handler.options = null;
        }

        return handler;
    }

}