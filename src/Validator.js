export default class Validator {

    static checkInstance(error, expected, ...variables) {
        if (!(error.prototype instanceof Error) && error !== Error) {
            throw new Error(Validator.#getInvalidMessage('error', error, Error));
        }

        function process(instance, simpleExpected) {
            if (simpleExpected == null) {
                return instance == null;
            }
            if (typeof instance === 'object') {
                if (typeof simpleExpected === 'function') {
                    return instance instanceof simpleExpected;
                } else if (typeof simpleExpected === 'string') {
                    return typeof instance === simpleExpected;
                } else {
                    throw new Error(Validator.#getInvalidMessage('expected',
                        simpleExpected, ['string', 'function']));
                }
            } else {
                if (typeof simpleExpected === 'function') {
                    return typeof instance === simpleExpected.name.toLowerCase();
                } else if (typeof simpleExpected === 'string') {
                    return typeof instance === simpleExpected;
                } else {
                    throw new Error(Validator.#getInvalidMessage('expected',
                        simpleExpected, ['string', 'function']));
                }
            }
        }

        let isValid;
        if (Array.isArray(expected)) {
            isValid = (instance) => {
                let value = false;
                for (let i in expected) {
                    value |= process(instance, expected[i]);
                }
                return value;
            }
        } else {
            isValid = (instance) => process(instance, expected);
        }

        for (let i in variables) {
            if (typeof variables[i] !== 'object') {
                throw new Error(`Expected 'Object' for variable ${i}. Got '${typeof variables[i]}' instead`)
            }
            const variableName = Object.keys(variables[i])[0];
            const variableValue = variables[i][variableName];
            if (!isValid(variableValue)) {
                throw new error(Validator.#getInvalidMessage(variableName, variableValue, expected));
            }
        }
    }

    static #getInvalidMessage(variableName, variableValue, expectedTypes) {
        function toString(value) {
            if (value == null) {
                return 'null';
            } else if (typeof value === 'function') {
                return value.name;
            } else if (typeof value === 'object' && !Array.isArray(value)) {
                return value.constructor.name;
            } else if (typeof value === 'string') {
                return value;
            }
            throw new Error(`Invalid type of value 'expectedTypes'`);
        }

        let validTypes = Validator.#getExpectedTypesMessage(toString(expectedTypes));
        if (Array.isArray(expectedTypes)) {
            validTypes = Validator.#getExpectedTypesMessage(expectedTypes.map(x => toString(x)));
        }
        return `Invalid type of value '${variableName}'. ${validTypes}`;
    }

    static #getExpectedTypesMessage(types) {
        if (typeof types !== 'string' && !Array.isArray(types) &&
            !types.every(x => typeof x === 'string')) {
            throw new Error(`Invalid type of value 'expected'. Expected 'string' or 'Array'`);
        }

        let result;
        if (Array.isArray(types)) {
            result = `Expected types: '${types.join("' or '")}'`;
        } else {
            result = `Expected type: '${types}'`;
        }

        return result;
    }

}
