
import notice from "@/assets/notice.mp3";
import calling from "@/assets/calling.mp3";
import type { SMessage } from "@/types/CMessage";
import { debounce } from "lodash";
import Recorder from 'recorder-core/recorder.mp3.min'
import 'recorder-core/src/extensions/buffer_stream.player'
export const playNotice = debounce(async () => {
    const audio = new Audio();
    audio.src = notice;
    await audio.play();
}, 200);

export const playCalling = () => {
    const audio = new Audio();
    audio.src = calling;
    audio.loop = true;
    
    audio.play();
    return () => {
        audio.pause();
        audio.currentTime = 0;
    }
}

var stream: any;
var initFlag = false
export const processBuffer = (data: SMessage) => {
    if(!initFlag){
        start();
        initFlag = true
    }
    const buffer = data.data;
    receiveAudioChunk(buffer)
};
export const stop = () => {
    if(stream){
		stream.stop();
	}
	stream=0;
}
export const start = () => {
    if (stream) {
        stop();
    }

    stream = Recorder.BufferStreamPlayer({
        decode: true, //传输过来的不是pcm就需要开启解码
        onInputError: (errMsg:any, inputIndex:any) => {
            console.log(
                "第" + inputIndex + "次的音频片段input输入出错: " + errMsg,
                1
            );
        },
        onPlayEnd: function () {
            if (!stream.isStop) {
                console.log(
                    "没有可播放的数据了，缓冲中 或者 已播放完成",
                    "#aaa"
                );
            }
        },
        transform:  (pcm:any, sampleRate:number, True:any, False:any) => {
            const Transform = (pcm:any,sampleRate:number,True:any,False:any) => {
                True(pcm,sampleRate);
            };
            Transform(
                pcm,
                sampleRate,
                function (pcm:any, sampleRate:number) {
                    True(pcm, sampleRate);
                },
                False
            );
            
        },
    });

    stream.start(
        function () {
           // recStart(); //调用Recorder连接到这个stream进行可视化绘制
        },
        function (err:any) {
            console.log("开始失败：" + err);
        }
    );
};

var receiveAudioChunk=function(arrayBuffer:any){
	if(stream){
		stream.input(arrayBuffer);
	}
};