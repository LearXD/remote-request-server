export default class Response {

    constructor(
        private uuid: string,
        private data: any
    ) { }

    public getUuid() {
        return this.uuid;
    }

    public getData() {
        return this.data;
    }

    public static fromString(payload: string) {
        const { uuid, data } = JSON.parse(payload);
        if (!uuid || !data) {
            throw new Error('Invalid data');
        }
        return new Response(uuid, data);
    }

    public toString() {
        return JSON.stringify({
            uuid: this.uuid,
            data: this.data
        });
    }
}