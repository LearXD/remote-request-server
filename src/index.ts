import { program } from "commander";
import WebSocketServer from "./services/websocket-server";

program
    .option("-p, --port <port>", "Port to run the WebSocket server on")
    .parse(process.argv);

const options = program.opts();
const port = options.port || 8080

const ws = new WebSocketServer({ port })

