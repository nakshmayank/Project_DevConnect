import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
    return io(BASE_URL); //here we are giving a backend url for socket.io to connect;
}