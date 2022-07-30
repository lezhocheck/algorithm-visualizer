import Rect from "./Rect";
import UtilsError from "./UtilsError";
import BaseObject from "./BaseObject";

export default class BaseObjectContainer {

    #objects;

    constructor() {
        this.#objects = new Set();
    }

    has(object) {
        return this.#objects.has(object);
    }

    add(object) {
        if (!(object instanceof BaseObject)) {
            throw new UtilsError(`Unknown type of object ${object}`);
        }
        if (this.#objects.has(object)) {
            throw new UtilsError(`Object is already in the container`);
        }
        this.#objects.add(object);
    }

    remove(object) {
        if (!this.#objects.has(object)) {
            throw new UtilsError(`Primitive is not in the container`);
        }
        this.#objects.delete(object);
    }

    forEach(callback) {
        this.#objects.forEach(x => callback(x));
    }

    hasOfType(classType) {
        return this.findOfType(classType).length !== 0;
    }

    findOfType(classType) {
        let result = [];
        this.#objects.forEach(x => {
            if (x instanceof classType) {
                result.push(x);
            }
        });
        return result;
    }

    clearAllOfType(classType) {
        let value = this.findOfType(classType);
        for (let i in value) {
            this.#objects.delete(value[i]);
        }
    }

}