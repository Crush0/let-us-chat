import type { Socket } from "socket.io-client";
import Recorder from 'recorder-core/recorder.mp3.min'
import type { CUser, SMessage } from "@/types/CMessage";
import { createDiscreteApi } from "naive-ui";
const { message } = createDiscreteApi(['message'])
var socket: Socket | undefined = undefined;
var rec: any;
var realTimeSendTryType: any;
var realTimeSendTryEncBusy: any;
var realTimeSendTryTime = 0;
var realTimeSendTryNumber: number;
var transferUploadNumberMax: number;
var realTimeSendTryChunk: any;
var SendInterval = 300;
var testSampleRate = 16000;
var testBitRate = 16;
export const recOpen = (type: string, socket_: any, room: string) => {
    console.log("recOpen");
    if(!socket_){
        message.error('服务器未响应')
    }
    if (!socket) {
        socket = socket_;
    } 
    if (rec) {
        rec.close();
    }
    rec = Recorder({
        type: "unknown",
        onProcess: function (
            buffers: any,
            _: any,
            __: any,
            bufferSampleRate: any
        ) {
            RealTimeSendTry(buffers, bufferSampleRate, false, room);
        },
    });
    rec.open(
        function () {
            rec.start(); //开始录音
            RealTimeSendTryReset(type); //重置环境，开始录音时必须调用一次
        },
        function (msg:any, isUserNotAllow:any) {
            console.log(msg, isUserNotAllow);
            message.error(msg);
        }
    );
    RealTimeSendTryReset(type);
};
export function recStop() {
    if(rec){
        rec.close();
    }
    
}
export default {
    recOpen,
    recStop,
};
const RealTimeSendTry = (
    buffers: any,
    bufferSampleRate: any,
    isClose: boolean,
    room: string
) => {
    var t1 = Date.now();
    if (realTimeSendTryTime == 0) {
        realTimeSendTryTime = t1;
        realTimeSendTryEncBusy = 0;
        realTimeSendTryNumber = 0;
        transferUploadNumberMax = 0;
        realTimeSendTryChunk = null;
    }
    if (!isClose && t1 - realTimeSendTryTime < SendInterval) {
        return; //控制缓冲达到指定间隔才进行传输
    }
    realTimeSendTryTime = t1;
    var number = ++realTimeSendTryNumber;

    var pcm = [],
        pcmSampleRate = 0;
    if (buffers.length > 0) {
        //借用SampleData函数进行数据的连续处理，采样率转换是顺带的，得到新的pcm数据
        var chunk = Recorder.SampleData(
            buffers,
            bufferSampleRate,
            testSampleRate,
            realTimeSendTryChunk,
            { frameType: isClose ? "" : realTimeSendTryType }
        );

        //清理已处理完的缓冲数据，释放内存以支持长时间录音，最后完成录音时不能调用stop，因为数据已经被清掉了
        for (
            var i = realTimeSendTryChunk ? realTimeSendTryChunk.index : 0;
            i < chunk.index;
            i++
        ) {
            buffers[i] = null;
        }
        realTimeSendTryChunk = chunk; //此时的chunk.data就是原始的音频16位pcm数据（小端LE），直接保存即为16位pcm文件、加个wav头即为wav文件、丢给mp3编码器转一下码即为mp3文件

        pcm = chunk.data;
        pcmSampleRate = chunk.sampleRate;
    }

    //没有新数据，或结束时的数据量太小，不能进行mock转码
    if (pcm.length == 0 || (isClose && pcm.length < 2000)) {
        TransferUpload(number, null, 0, null, isClose, room);
        return;
    }

    //实时编码队列阻塞处理
    if (!isClose) {
        if (realTimeSendTryEncBusy >= 2) {
            return;
        }
    }
    realTimeSendTryEncBusy++;

    //通过mock方法实时转码成mp3、wav；16位pcm格式可以不经过此操作，直接发送new Blob([pcm.buffer],{type:"audio/pcm"}) 要8位的就必须转码
    var encStartTime = Date.now();
    var recMock = Recorder({
        type: realTimeSendTryType,
        sampleRate: testSampleRate, //采样率
        bitRate: testBitRate, //比特率
    });
    recMock.mock(pcm, pcmSampleRate);
    recMock.stop(
        function (blob: any, duration: number) {
            realTimeSendTryEncBusy && realTimeSendTryEncBusy--;
            blob.encTime = Date.now() - encStartTime;
            TransferUpload(number, blob, duration, recMock, isClose, room);
        },
        function (msg: any) {
            realTimeSendTryEncBusy && realTimeSendTryEncBusy--;
            console.log(msg);
        }
    );
};
const TransferUpload = (
    number: any,
    blobOrNull: any,
    duration: any,
    blobRec: any,
    isClose: boolean,
    room: string
) => {
    transferUploadNumberMax = Math.max(transferUploadNumberMax, number);
    if (blobOrNull) {
        var blob = blobOrNull;
        // var encTime=blob.encTime;
        socket?.emit("audioStream", {
            type: "audioStream",
            data: blob,
            extra: room,
        } as SMessage);
    }
    if (isClose) {
        console.log("Close");
    }
};

var RealTimeSendTryReset = function (type: string) {
    realTimeSendTryType = type;
    realTimeSendTryTime = 0;
};
