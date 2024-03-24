import { v4 as uuidv4 } from 'uuid';

export default class Request {

    constructor(
        private url: string,
        private options: RequestInit,
        private target: string,
        private uuid: string = uuidv4()
    ) { }

    public async execute() {
        return fetch(this.url, this.options)
            .then(response => response.text())
    }

    public static fromString(data: string) {
        const { url, options, uuid, target } = JSON.parse(data);
        if (!url || !options || !uuid || !target) {
            throw new Error('Invalid data');
        }
        return new Request(url, options, target, uuid);
    }

    public getUrl() {
        return this.url;
    }

    public getUuid() {
        return this.uuid;
    }

    public getTarget() {
        return this.target;
    }

    public toString() {
        return JSON.stringify({
            uuid: this.uuid,
            target: this.target,
            url: this.url,
            options: this.options
        });
    }
}