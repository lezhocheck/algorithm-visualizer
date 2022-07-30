import ComponentError from "./ComponentError";
import Rect from "./main/utils/Rect";
import Vector2 from "./main/utils/Vector2";

// Guarantee unique ID
let __ID = 0;
const __componentsPool = [];

export default class Component {

    #id;
    #type;

    constructor(type, properties) {
        this.#id = 'component_' + type + '_' + __ID++;
        this.#type = type;

        this._domElement = document.createElement(this.#type);
        this._domElement.setAttribute('id', this.#id);

        const defaultParent = document.getElementById('root');
        defaultParent.appendChild(this._domElement);

        if (properties != null) {
            const attributes = properties.hasOwnProperty('attributes') ? properties.attributes : null;
            const children = properties.hasOwnProperty('children') ? properties.children : null;
            this.#update(attributes, children);
        }

        __componentsPool.push(this);
    }

    get id() { return this.#id; }

    get value() {
        return this._domElement.value;
    }

    get boundRect() {
        const rect = this._domElement.getBoundingClientRect();
        return new Rect(new Vector2(rect.x, rect.y), rect.width, rect.height);
    }

    get checked() {
        return this._domElement.checked;
    }

    get parent() {
        const parentId = this._domElement.parentElement.id;
        return __componentsPool.find(component => component.id === parentId);
    }

    // Removes component with its children
    remove() {
        this._domElement.remove();
    }

    removeChildren() {
        this._domElement.removeChildren();
    }

    removeAttribute(attribute) {
        if (!this._domElement.hasAttribute(attribute)) {
            throw new ComponentError(`Unknown attribute '${attribute}'`);
        }

        this._domElement.removeAttribute(attribute);
    }

    getChildrenCount() {
        return this._domElement.children.length;
    }

    getChild(index) {
        const children = this._domElement.children;
        if (index < 0 || index > children.length - 1) {
            throw new ComponentError(`Index was out of range`);
        }
        const id = Array.from(children)[index].id;
        return __componentsPool.find(component => component.id === id);
    }

    removeChild(child) {
        if (child instanceof Component) {
            this._domElement.removeChild(child._domElement);
        } else {
            throw new ComponentError(`Unknown child '${child}' type`);
        }
    }

    // If attribute exists already -> the value will be updated
    // else -> attribute will be added
    // the same with children
    update(properties) {
        if (properties == null) {
            throw new ComponentError(`Properties are undefined`);
        }

        const attributes = properties.hasOwnProperty('attributes') ? properties.attributes : null;
        const children = properties.hasOwnProperty('children') ? properties.children : null;

        const filtered = Object.keys(properties).filter(x => x !== 'attributes' && x !== 'children');
        for (let i in filtered) {
            const prop = filtered[i];
            this.setProperty(prop, properties[prop]);
        }

        this.#update(attributes, children);
    }

    hasProperty(property) {
        return this._domElement.hasOwnProperty(property);
    }

    getProperty(property) {
        if (!this.hasProperty(property)) {
            throw new ComponentError(`Object has not got such an attribute`);
        }
        return this._domElement[property];
    }

    setProperty(property, value) {
        if (property === 'id') {
            throw new ComponentError(`Cannot set id`);
        }
        this._domElement[property] = value;
    }

    deleteProperty(property) {
        if (!this.hasProperty(property)) {
            throw new ComponentError(`Object has not got such an attribute`);
        }
        delete this._domElement[property];
    }

    #update(attributes, children) {
        for (let key in attributes) {
            if (typeof key !== 'string') {
                throw new ComponentError(`Invalid attribute name`);
            } else if (key === 'id') {
                throw new ComponentError(`Cannot set an id to the component`);
            } else if (key === 'className') {
                this._domElement.className = attributes[key];
                continue;
            }

            this._domElement.setAttribute(key, attributes[key]);
        }

        if (children instanceof Component || typeof children === 'string') {
            this.#process_child(children);
        } else if (Array.isArray(children)) {
            children.forEach(child => {
                this.#process_child(child);
            });
        } else if (children != null) {
            throw new ComponentError(`Unknown type '${typeof children}'. Expected 'Array'`)
        }
    }

    #process_child(child) {
        if (child instanceof Component) {
            const c = this._domElement.querySelector('#' + child.#id);
            if (c == null) {
                this._domElement.appendChild(child._domElement);
            } else {
                this._domElement.replaceChild(c, child._domElement);
            }
        } else if(typeof child === 'string') {
            this._domElement.textContent = child;
        } else {
            throw new ComponentError(`Cannot add a child with type '${typeof child}'`);
        }
    }
}