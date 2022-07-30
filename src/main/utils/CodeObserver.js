import UtilsError from "./UtilsError";

export default class CodeObserver {

    #savedArgsNames;
    #states;
    #currentStates;
    #counter;

    constructor() {
        this.#states = new Map();
        this.#savedArgsNames = new Set();
        this.#currentStates = new Map();
        this.#counter = Number.MIN_SAFE_INTEGER;
    }

    saveState(title, args) {
        if (typeof title !== 'string') {
            throw new UtilsError(`Parameter 'title' must be of type 'string'`);
        }
        if (typeof args !== 'object' || args == null) {
            throw new UtilsError(`Parameter 'args' must be of type 'object'`);
        }
        for (let i in args) {
            if (args.hasOwnProperty(i)) {
                this.#savedArgsNames.add(i);
            }
        }
        const state = {value: args, score: this.#counter++};
        if (this.#states.has(title)) {
            const array = this.#states.get(title);
            array.push(state);
        } else {
            this.#states.set(title, [state]);
            this.#currentStates.set(title, 0);
        }
    }

    clear() {
        this.#states = new Map();
        this.#savedArgsNames = new Set();
        this.#currentStates = new Map();
        this.#counter = Number.MIN_SAFE_INTEGER;
    }

    hasNext(title) {
        console.log(this)
        if (!this.hasTitle(title)) {
            throw new UtilsError(`Unknown title`);
        }
        return this.#currentStates.get(title) + 1 < this.#states.get(title).length;
    }

    hasPrevious(title) {
        console.log(this)
        if (!this.hasTitle(title)) {
            throw new UtilsError(`Unknown title`);
        }
        return this.#currentStates.get(title) - 1 >= 0;
    }

    setCurrentState(title, position) {
        if (!this.#currentStates.has(title)) {
            throw new UtilsError(`Unknown title`);
        }
        if (typeof position !== 'number') {
            throw new UtilsError(`Parameter 'position' must be of type 'number'`);
        }
        if (position < 0 || position >= this.#states.length) {
            throw new UtilsError(`Invalid position value`);
        }
        this.#currentStates.set(title, position);
    }

    hasTitle(title) {
        return this.#states.has(title);
    }

    observe(title, handler) {
        if (!this.hasTitle(title)) {
            return;
        }
        const current = this.#currentStates.get(title);
        const state = this.#states.get(title)[current].value;
        const args = Object.keys(state).map(k => state[k]);
        const requiredArgs = __getParameters(handler);
        for(let i in requiredArgs) {
            if (!this.#savedArgsNames.has(requiredArgs[i])) {
                throw new UtilsError(`Unknown handler argument '${requiredArgs[i]}'`);
            }
        }
        handler.apply(handler, args);
    }

    next(title) {
        if (!this.hasNext(title)) {
            throw new UtilsError(`No elements`);
        }
        this.#currentStates.set(this.#currentStates.get(title) + 1);
    }

    previous(title) {
        if (!this.hasPrevious(title)) {
            throw new UtilsError(`No elements`);
        }
        this.#currentStates.set(this.#currentStates.get(title) - 1);
    }

}

const __STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const __ARGUMENT_NAMES = /([^\s,]+)/g;

function __getParameters(func) {
    const functionString = func.toString().replace(__STRIP_COMMENTS, '');
    let result = functionString.slice(functionString.indexOf('(') + 1,
        functionString.indexOf(')')).match(__ARGUMENT_NAMES);
    if (result == null) {
        result = [];
    }

    return result;
}
