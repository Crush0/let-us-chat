<script setup lang="ts">
import { useUserStore } from '@/stores/userConfig';
import type { CMessage, CUser, SMessage } from '@/types/CMessage'
import { VoiceEvent, VoiceState } from '@/types/VoiceEnum';
import { addVoiceHandler, removeVoiceHandler } from '@/ws/voiceSocket';
import { Call } from '@vicons/ionicons5';
import { useMessage } from 'naive-ui';
import type { Socket } from 'socket.io-client';
import { inject, ref, watch, type Ref } from 'vue';
import rtc from '@/utils/rtc'
import { playCalling, processBuffer } from '@/utils/audioPlay';
const props = defineProps<{ user: CUser | null }>();
const emits = defineEmits(['update:user'])
const voiceOption = ref({
    status: VoiceState.disconnected,
    startTime: new Date(),
})
const userStore = useUserStore()
const voiceSocket: Ref<Socket | undefined> = ref(inject('voiceSocket'))
const duration = ref('')
const durationIntervalHandler = () => {
    const now = new Date()
    const diff = now.getTime() - voiceOption.value.startTime.getTime()
    // 获得 小时：分钟：秒 ，补0
    const hour = Math.floor(diff / 3600000).toString().padStart(2, '0')
    const minute = (Math.floor(diff / 60000) % 60).toString().padStart(2, '0')
    const second = (Math.floor(diff / 1000) % 60).toString().padStart(2, '0')
    duration.value = `${hour}:${minute}:${second}`
}

const durationIntervalId = ref(0)

watch(() => voiceOption.value.status, (newVal) => {
    if (newVal === VoiceState.inCall) {
        durationIntervalId.value = setInterval(durationIntervalHandler, 5)
    } else if (newVal === VoiceState.disconnected) {
        clearInterval(durationIntervalId.value)
    }

}, {
    deep: true,
})
const stopCalling:any = ref(null)

const isShowPanel = ref(false)
const show = () => {
    voiceOption.value.status = VoiceState.waitingForAccept
    isShowPanel.value = true
}

const hide = () => {
    isShowPanel.value = false
    voiceOption.value.status = VoiceState.disconnected;
    rtc.recStop()
}
const sender: any = ref({})
const receiver: any = ref({})
const startChat = (state: any, data: any) => {
    voiceOption.value.status = state === VoiceEvent.initiateCall ? VoiceState.waitingForAccept : state;
    const { sender: su, receiver: ru } = data;

    sender.value = su
    receiver.value = ru
    voiceSocket.value?.emit(state, {
        data: {
            ...data
        } as CMessage
    } as SMessage)
    stopCalling.value = playCalling()
}
const handleCallBtn = () => {
    if(stopCalling.value){
        stopCalling.value.call(undefined)
        stopCalling.value = null
    }
    if (voiceOption.value.status === VoiceState.inCall || sender.value.uuid === userStore.getMyUser.uuid) {
        removeVoiceHandler(VoiceEvent.audioStream)
        //如果是挂断
        voiceSocket.value?.emit(VoiceEvent.hangUp, {
            type: 'hangup',
            data: {
                receiver: receiver.value,
                sender: sender.value
            }
        } as SMessage)
        voiceSocket.value?.emit(VoiceEvent.hangUp, {
            type: 'hangup',
            data: {
                receiver: sender.value,
                sender: receiver.value
            }
        } as SMessage)
        emits('update:user', {
            uuid: '-1000',
            name: '未知用户',
            type: 'user'
        } as CUser)
        setTimeout(() => {
            hide()
        }, 1000)
        voiceOption.value.status = VoiceState.disconnected
    } else {
        //如果是接听
        voiceSocket.value?.emit(VoiceEvent.acceptCall, {
            type: 'accept',
            data: {
                time: new Date(),
                receiver: receiver.value,
                sender: sender.value
            } as CMessage
        })
        voiceOption.value.status = VoiceState.inCall;
        voiceOption.value.startTime = new Date();
        addVoiceHandler(VoiceEvent.audioStream,processBuffer)
        if (props.user) {
            rtc.recOpen('mp3', voiceSocket.value, props.user)
        }

    }
}
const message = useMessage()
const reject = () => {
    if(stopCalling.value){
        stopCalling.value.call(undefined)
        stopCalling.value = null
    }
    voiceSocket.value?.emit(VoiceEvent.hangUp, {
        type: 'hangup',
        data: {
            receiver: receiver.value,
            sender: sender.value
        }
    } as SMessage)
    emits('update:user', {
        uuid: '-1000',
        name: '未知用户',
        type: 'user'
    } as CUser)
    setTimeout(() => {
        hide()
    }, 1000)
    voiceOption.value.status = VoiceState.disconnected
}
addVoiceHandler('reject', (data: any) => {
    if(stopCalling.value){
        stopCalling.value.call(undefined)
        stopCalling.value = null
    }
    message.error(data.data)
    setTimeout(() => {
        hide()
    }, 1000)
    emits('update:user', {
        uuid: '-1000',
        name: '未知用户',
        type: 'user'
    } as CUser)
    
})
addVoiceHandler(VoiceEvent.acceptCall, (_: any) => {
    // 对方接受了聊天请求
    voiceOption.value.status = VoiceState.inCall
    voiceOption.value.startTime = new Date();
    console.log('对方接受了聊天请求');
    addVoiceHandler(VoiceEvent.audioStream,processBuffer)
    if (props.user) {
        rtc.recOpen('mp3', voiceSocket.value, props.user)
    }
    if(stopCalling.value){
        stopCalling.value.call(undefined)
        stopCalling.value = null
    }
})

addVoiceHandler(VoiceEvent.initiateCall, (data: SMessage) => {
    // 对方发起了聊天请求
    stopCalling.value = playCalling()
    voiceOption.value.status = VoiceState.waitingForAccept
    const { sender: su, receiver: ru } = data.data
    sender.value = su
    receiver.value = ru
    show()
    emits('update:user', su as CUser)
})
addVoiceHandler(VoiceEvent.hangUp, () => {
    if(stopCalling.value){
        stopCalling.value.call(undefined)
        stopCalling.value = null
    }
    console.log('挂断');
    removeVoiceHandler(VoiceEvent.audioStream)
    // 对方挂断 | 拒绝
    setTimeout(() => {
        hide()
    }, 1000)
    emits('update:user', {
        uuid: '-1000',
        name: '位置用户',
        type: 'user'
    } as CUser)
    voiceOption.value.status = VoiceState.disconnected
})
defineExpose({ show, startChat, hide })
</script>

<template>
    <Teleport to="body">
        <div class="voice-chat">
            <Transition>
                <div class="show-panel-btn" v-if="voiceOption.status !== VoiceState.disconnected">
                    <n-button strong :secondary="isShowPanel" circle type="info" @click="isShowPanel = !isShowPanel">
                        <template #icon>
                            <n-icon class="icon"
                                :style="{ animationName: voiceOption.status === VoiceState.waitingForAccept ? 'btn-shake-circle' : undefined }">
                                <Call />
                            </n-icon>
                        </template>
                    </n-button>
                </div>
            </Transition>
            <Transition>
                <div v-if="isShowPanel" class="d-d" v-dragSwitch="true">
                    <div class="d-d_container" style="right: 20px; top: 60px">
                        <div class="d-d_container_header">{{ user?.name ?? '语音聊天' }}</div>
                        <div class="d-d_container_content">
                            <div class="user-header">
                                <n-avatar class="user-avatar" :src="user?.avatar">
                                    {{ user?.name.slice(0, 2) }}
                                </n-avatar>
                                <div class="user-name">
                                    {{ user?.name ?? '未知用户' }}
                                </div>
                            </div>

                            <div class="time-line">
                                <span v-if="voiceOption.status === VoiceState.inCall">{{ duration }}</span>
                                <span v-else-if="voiceOption.status === VoiceState.waitingForAccept">等待接通...</span>
                                <span v-else-if="voiceOption.status === VoiceState.disconnected">已挂断</span>
                            </div>
                            <div class="control-btn">
                                <n-button :disabled="voiceOption.status === VoiceState.disconnected" @click="handleCallBtn"
                                    strong circle
                                    :type="voiceOption.status === VoiceState.inCall || sender.uuid === userStore.getMyUser.uuid ? 'error' : 'success'">
                                    <template #icon>
                                        <n-icon class="icon">
                                            <Call />
                                        </n-icon>
                                    </template>
                                </n-button>
                                <n-button :disabled="voiceOption.status === VoiceState.disconnected" @click="reject"
                                    v-if="user?.uuid !== '-1000' && sender.uuid !== userStore.getMyUser.uuid && voiceOption.status !== VoiceState.inCall"
                                    strong circle type="error">
                                    <template #icon>
                                        <n-icon class="icon">
                                            <Call />
                                        </n-icon>
                                    </template>
                                </n-button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </Teleport>
</template>

<style scoped>
.voice-chat .d-d .d-d_container {
    border-radius: 8px;
}

.d-d,
.show-panel-btn {
    width: auto;
    height: auto;
    position: absolute;
}

.user-header {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.user-name {
    margin-top: 5px;
}

.d-d_container_content {
    display: flex;
    width: 100%;
    height: calc(100% - 40px);
    align-items: center;
    flex-direction: column;
    justify-content: space-evenly;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.show-panel-btn {
    top: 20px;
    right: 20px;
    width: 50px;
    height: 50px;

}

.show-panel-btn:deep(.icon) {
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-delay: 2s;
}

.d-d_container_header {
    height: 40px;
    line-height: 40px;
}

.d-d_container {
    width: 200px;
    height: 400px;
    position: fixed;
    background-color: rgba(16 18 27 / 60%);
    user-select: none;


}

.d-d_container_header {
    text-align: center;
    border-bottom: 1px solid var(--border-color);
}

.control-btn {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-evenly;
}
</style>