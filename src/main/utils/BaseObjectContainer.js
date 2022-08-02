import UtilsError from "./UtilsError";
import BaseObject from "./BaseObject";
import Validator from "../../Validator";

export default class BaseObjectContainer {

    #objects;

    constructor() {
        this.#objects = new Set();
    }

    has(object) {
        return this.#objects.has(object);
    }

    add(object) {
        Validator.checkInstance(UtilsError, BaseObject, {object: object});
        if (this.#objects.has(object)) {
            throw new UtilsError(`Object is already in the container`);
        }
        this.#objects.add(object);
    }

    remove(object) {
        if (!this.#objects.has(object)) {
            throw new UtilsError(`Object is not in the container`);
        }
        this.#objects.delete(object);
    }

    forEach(callback) {
        this.#objects.forEach(x => callback(x));
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