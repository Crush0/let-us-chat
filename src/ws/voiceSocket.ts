import io, { Socket, type ManagerOptions, type SocketOptions } from 'socket.io-client';

const URL = 'http://127.0.0.1:3000/voice';

var socket: Socket | null = null

export const getVoiceInstance = (options:Partial<ManagerOptions & SocketOptions> | undefined = undefined) => {
    if(!socket){
        socket = io(URL, options)
    }
    return socket
}

export const addVoiceHandler = (evt: string, callback: any) => {
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

export const removeVoiceHandler = (evt: string) => {
    new Promise<Socket>((reslove,_) => {
        setInterval(() => {
            if(socket){
                reslove(socket)
            }
        }, 16)
    }).then((socket_) => {
        socket_.off(evt)
    })
}