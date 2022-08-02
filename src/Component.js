import ComponentError from "./ComponentError";
import Validator from "./Validator";

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
        this._domElement.replaceChildren();
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
        Validator.checkInstance(ComponentError, Component, {child: child});
        this._domElement.removeChild(child._domElement);
    }

    // If attribute exists already -> the value will be updated
    // else -> attribute will be added
    // the same with children
    update(properties) {
        Validator.checkInstance(ComponentError, Object, {properties: properties});

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
        Validator.checkInstance(ComponentError, Object, {property: this._domElement[property]});
        return this._domElement[property];
    }

    setProperty(property, value) {
        if (property === 'id') {
            throw new ComponentError(`Cannot set id`);
        }
        this._domElement[property] = value;
    }

    deleteProperty(property) {
        Validator.checkInstance(ComponentError, Object, {property: this._domElement[property]});
        delete this._domElement[property];
    }

    #update(attributes, children) {
        for (let key in attributes) {
            if (key === 'id') {
                throw new ComponentError(`Cannot set an id to the component`);
            } else if (key === 'className') {
                this._domElement.className = attributes[key];
                continue;
            }

            this._domElement.setAttribute(key, attributes[key]);
        }

        Validator.checkInstance(ComponentError, [Object, String, Component, null], {children: children});

        if (children instanceof Component || typeof children === 'string') {
            this.#process_child(children);
        } else if (Array.isArray(children)) {
            children.forEach(child => {
                this.#process_child(child);
            });
        }
    }

    #process_child(child) {
        Validator.checkInstance(ComponentError, [String, Component], {child: child});
        if (child instanceof Component) {
            const c = this._domElement.querySelector('#' + child.#id);
            if (c == null) {
                this._domElement.appendChild(child._domElement);
            } else {
                this._domElement.replaceChild(c, child._domElement);
            }
        } else if(typeof child === 'string') {
            this._domElement.textContent = child;
        }
    }
}