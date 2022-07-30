import UtilsError from "./UtilsError";

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

class Step {

    #handler;
    #parameters;
    #observer;

    constructor(handler, observer = null) {
        if (typeof handler != 'function') {
            throw new UtilsError(`Handler must be a 'function'`);
        }
        if (observer != null && typeof observer !== 'function') {
            throw new UtilsError(`Observer must be a 'function'`);
        }
        this.#handler = handler;
        this.#parameters = __getParameters(this.#handler);
        this.#observer = observer;
    }

    get handlerParameters() { return this.#parameters; }

    go(args) {
        const t = Object.keys(args).map(k => args[k]);
        const result = this.#handler.apply(this.#handler, t);
        if (this.#observer != null) {
            this.#observer(result);
        }
    }

}

class CodeRunner {

    #initArgumentsObject;
    #initArgumentsSet;
    #steps;
    #currentStep;

    constructor(initialArguments, steps = null) {
        if (!Array.isArray(steps) && steps != null) {
            throw new UtilsError(`Parameter 'steps' must be of type 'Array'`);
        }
        if (typeof initialArguments !== 'object') {
            throw new UtilsError(`Parameter 'globalArguments' must be of type 'object'`);
        }
        this.#steps = [];
        this.#currentStep = 0;
        this.#initArgumentsObject = initialArguments;
        this.#initArgumentsSet = new Set();

        for (let property in initialArguments) {
            if (initialArguments.hasOwnProperty(property)) {
                this.#initArgumentsSet.add(property);
            }
        }

        if (steps != null) {
            for (let i in steps) {
                this.add(steps[i]);
            }
        }
    }

    add(step, times = 1, position = null) {
        if (typeof times !== 'number') {
            throw new UtilsError(`Parameter 'times' must be of type 'number'`);
        }
        if (times < 1) {
            throw new UtilsError(`Invalid 'times' parameter`);
        }
        if (!(step instanceof Step)) {
            throw new UtilsError(`Parameter 'step' must be of type 'Step'`);
        }
        if (typeof position !== 'number' && position != null) {
            throw new UtilsError(`Parameter 'position' must be of type 'number'`);
        }
        step.handlerParameters.forEach(x => {
            if (!this.#initArgumentsSet.has(x)) {
                throw new UtilsError(`Unknown code handler parameter '${x}'`);
            }
        });
        for (let i = 0; i < times; i++) {
            if (position != null) {
                this.#steps.push(step);
            } else {
                this.#steps.splice(position, 0, step);
            }
        }
    }

    hasNext() { return this.#currentStep + 1 < this.#steps.length; }
    hasPrevious() { return this.#currentStep - 1 >= 0; }

    goTo(position) {
        if (typeof position !== 'number') {
            throw new UtilsError(`Parameter 'position' must be of type 'number'`);
        }
        if (position < 0 || position >= this.#steps.length) {
            throw new UtilsError(`Invalid position value`);
        }
        this.#currentStep = position;
    }

    run() {
        if (this.#steps.length > 0) {
            this.runForwardTo(this.#steps.length - 1);
        }
    }

    runForwardTo(position) {
        if (typeof position !== 'number') {
            throw new UtilsError(`Parameter 'position' must be of type 'number'`);
        }
        if (position <= this.#currentStep || position >= this.#steps.length) {
            throw new UtilsError(`Invalid position value`);
        }
        const difference = position - this.#currentStep;
        for (let i = 0; i < difference; i++) {
            this.next();
        }
    }

    runBackwardTo(position) {
        if (typeof position !== 'number') {
            throw new UtilsError(`Parameter 'position' must be of type 'number'`);
        }
        if (position >= this.#currentStep || position < 0) {
            throw new UtilsError(`Invalid position value`);
        }
        const difference = this.#currentStep - position;
        for (let i = 0; i < difference; i++) {
            this.previous();
        }
    }

    skip(count) {
        if (typeof count !== 'number') {
            throw new UtilsError(`Parameter 'count' must be of type 'number'`);
        }
        const position = this.#currentStep + count;
        if (position < 0 || position >= this.#steps.length) {
            throw new UtilsError(`Invalid count value`);
        }
        this.#currentStep = position;
    }

    next() {
        if (!this.hasNext()) {
            throw new UtilsError(`No elements`);
        }
        this.#steps[this.#currentStep].go(this.#initArgumentsObject);
        this.#currentStep++;
    }

    previous() {
        if (!this.hasPrevious()) {
            throw new UtilsError(`No elements`);
        }
        const f = this.#steps[this.#currentStep].go;
        const args = Object.keys(this.#initArgumentsObject).map(k => this.#initArgumentsObject[k]);
        f.apply(this.#steps[this.#currentStep], args);
        this.#currentStep--;
    }

}

export {Step, CodeRunner};