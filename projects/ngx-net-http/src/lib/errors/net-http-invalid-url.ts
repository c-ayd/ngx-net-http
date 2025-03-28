export class NetHttpInvalidUrl extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'Invalid URL';
    }
}
