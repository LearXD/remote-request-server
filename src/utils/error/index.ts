export default class Error {
    constructor(
        private message: string,
        private requestUuid: string
    ) { }

    public getMessage = () => {
        return this.message
    }

    public toString = () => {
        return JSON.stringify({
            type: 'error',
            message: this.message,
            uuid: this.requestUuid
        })
    }
}