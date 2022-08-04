import UtilsError from "./UtilsError";
import Validator from "../../Validator";

export default class CodeObserver {

    #savedArgsNames;
    #states;
    #counter;
    #currentStates;

    constructor() {
        this.#states = new Map();
        this.#savedArgsNames = new Set();
        this.#currentStates = new Map();
        this.#counter = Number.MIN_SAFE_INTEGER;
    }

    saveState(title, args) {
        Validator.checkInstance(UtilsError, String, {title: title});
        Validator.checkInstance(UtilsError, Object, {args: args});
        for (const i in args) {
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
            this._currentStates.set(title, 0);
        }
    }

    clear() {
        this.#states = new Map();
        this.#savedArgsNames = new Set();
        this._currentStates = new Map();
        this.#counter = Number.MIN_SAFE_INTEGER;
    }

    hasNext(title) {
        if (!this.hasTitle(title)) {
            throw new UtilsError(`Unknown title`);
        }
        return this._currentStates.get(title) + 1 < this.#states.get(title).length;
    }

    hasPrevious(title) {
        if (!this.hasTitle(title)) {
            throw new UtilsError(`Unknown title`);
        }
        return this._currentStates.get(title) - 1 >= 0;
    }

    static #merge(title, left, right) {
        function mapItem(item) {
            if (item.hasOwnProperty('title')) {
                return {title: item.title, score: item.score, value: item.value};
            } else {
                return {title: title, score: item.score, value: item.value};
            }
        }

        let arr = [];
        while (left.length && right.length) {
            let item;
            if (left[0].score < right[0].score) {
                item = left.shift();
            } else {
                item = right.shift();
            }
            arr.push(mapItem(item));
        }
        const addLeft = left.map(item => mapItem(item));
        const addRight = right.map(item => mapItem(item));

        return [...arr, ...addLeft, ...addRight]
    }

    getAllStates() {
        let container = [];
        for (const [title, states] of this.#states) {
            container = CodeObserver.#merge(title, container, states);
        }
        return container.map(item => new Object({title: item.title, value: item.value}));
    }

    hasTitle(title) {
        return this.#states.has(title);
    }

    observe(title, handler) {
        if (!this.hasTitle(title)) {
            return;
        }
        const current = this._currentStates.get(title);
        const state = this.#states.get(title)[current].value;
        const args = Object.keys(state).map(k => state[k]);
        const requiredArgs = __getParameters(handler);
        for(const arg of requiredArgs) {
            if (!this.#savedArgsNames.has(arg)) {
                throw new UtilsError(`Unknown handler argument '${arg}'`);
            }
        }
        handler.apply(handler, args);
    }

    next(title) {
        if (!this.hasNext(title)) {
            throw new UtilsError(`No elements`);
        }
        this._currentStates.set(title, this._currentStates.get(title) + 1);
        console.log(this._currentStates.get(title))
    }

    previous(title) {
        if (!this.hasPrevious(title)) {
            throw new UtilsError(`No elements`);
        }
        this._currentStates.set(title, this._currentStates.get(title) - 1);
        console.log(this._currentStates.get(title))
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
