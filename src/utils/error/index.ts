export default class Error {
    constructor(
        private message: string,
        private requestUuid: string
    ) { }

    public getMessage = () => {
        return this.message
    }

    public getRequestUuid = () => {
        return this.requestUuid
    }

    public static fromString = (data: string) => {
        const parsed = JSON.parse(data)
        return new Error(parsed.message, parsed.uuid)
    }

    public toString = () => {
        return JSON.stringify({
            type: 'error',
            message: this.message,
            uuid: this.requestUuid
        })
    }
}