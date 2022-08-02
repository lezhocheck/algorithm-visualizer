export default class LayoutError extends Error {

    constructor(message) {
        super(message);
        this.name = 'LayoutError';
    }

}