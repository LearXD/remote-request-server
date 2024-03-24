import { WebSocket, WebSocketServer as WsServer } from 'ws'
import { WebSocketServerConfig } from "./types";

import { v4 as uuidv4 } from 'uuid';
import Request from '../../utils/request';
import Response from '../../utils/response';
import Error from '../../utils/error';

export default class WebSocketServer {

    private instance: WsServer

    private clients: Map<string, WebSocket> = new Map()
    private identifiers: Map<string, string> = new Map()

    private requests: Map<string, WebSocket> = new Map()

    public getClient = (id: string) => {
        return this.clients.get(id)
    }

    public addClient = (client: WebSocket) => {
        const randomId = uuidv4()
        this.clients.set(randomId, client)
        return randomId
    }

    public removeClient = (id: string) => {
        this.clients.delete(id)
    }

    public getClients = () => {
        return this.clients
    }

    public setClientIdentifier = (id: string, identifier: string) => {
        this.identifiers.set(identifier, id)
    }

    public getClientIdentifier = (identifier: string) => {
        return this.clients.get(this.identifiers.get(identifier))
    }

    public addRequest = (uuid: string, origin: WebSocket) => {
        this.requests.set(uuid, origin)
    }

    public getRequestOrigin = (uuid: string) => {
        return this.requests.get(uuid)
    }

    constructor(private config: WebSocketServerConfig) {
        this.init()
    }

    public async init() {
        this.instance = new WsServer({ port: this.config.port })

        this.instance.on('listening', () => {
            console.log('WebSocket server is listening on port', this.config.port)
        })

        this.registerEvents()
    }

    public registerEvents = () => {
        this.instance.on('connection', (socket) => {
            const clientId = this.addClient(socket)

            socket.on('message', (data) => {
                try {
                    const payload = JSON.parse(data.toString())

                    switch (payload.type) {
                        case 'identifier':
                            this.setClientIdentifier(clientId, payload.identifier)
                            break;
                        case 'response':
                            console.log(`Received response from ${clientId}`)
                            const response = Response.fromString(payload.data)

                            const origin = this.getRequestOrigin(response.getUuid())
                            this.requests.delete(response.getUuid())

                            if (!origin) {
                                return socket.send(new Error('Origin not found', response.getUuid()).toString())
                            }

                            origin.send(data)
                            break;
                        case 'request':
                            const request = Request.fromString(payload.data)

                            const client = this.getClientIdentifier(request.getTarget())

                            if (!client) {
                                return socket.send(new Error('Client not found', request.getUuid()).toString())
                            }

                            this.requests.set(request.getUuid(), socket)
                            setTimeout(() => { this.requests.delete(request.getUuid()) }, 1000 * 60)
                            return client.send(data)
                    }

                } catch (error) {
                    console.error(error)
                    socket.send(JSON.stringify({ error: 'Unknown error' }))
                }
            });

            socket.on('close', () => {
                this.removeClient(clientId)
                this.identifiers.forEach((value, key) => {
                    if (value === clientId) {
                        this.identifiers.delete(key)
                    }
                })
            })
        });
    }
}