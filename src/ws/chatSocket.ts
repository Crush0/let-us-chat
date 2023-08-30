import io, { Socket, type ManagerOptions, type SocketOptions } from 'socket.io-client';

const URL = 'http://124.220.65.47:3002/chat';

var socket: Socket | null = null

export const getInstance = (options:Partial<ManagerOptions & SocketOptions> | undefined = undefined) => {
    if(!socket){
        socket = io(URL, options)
    }
    return socket
}

export const addHandler = (evt: string, callback: any) => {
    new Promise<Socket>((reslove,_) => {
        setInterval(() => {
            if(socket){
                reslove(socket)
            }
        }, 16)
    }).then((socket_) => {
        socket_.on(evt, callback)
    })
}