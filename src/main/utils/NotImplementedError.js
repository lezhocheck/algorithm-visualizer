export default class NotImplementedError extends Error {

    constructor(message) {
        super(message == null ? 'Method must be implemented' : message);
        this.name = 'NotImplementedError';
    }

}