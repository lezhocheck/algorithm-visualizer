export default class UtilsError extends Error {

    constructor(message) {
        super(message);
        this.name = 'UtilsError';
    }

}