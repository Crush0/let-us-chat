<script setup lang="ts">
import { provide, ref, type Ref } from 'vue'
import { getInstance } from '@/ws/chatSocket';
import { useUserStore } from '@/stores/userConfig';
import type { CUser } from '@/types/CMessage';
import type { Socket } from 'socket.io-client';
import { getUuid } from '@/utils/uuid';
import { utoa } from '@/utils/encode';
import { useMessage } from 'naive-ui';
import { getVoiceInstance } from '@/ws/voiceSocket';
import { useRouter } from 'vue-router';
const userStore = useUserStore()
const showModal = ref(true)
const uname = ref('')
const router = useRouter()
const socket: Ref<Socket | null> = ref(null)
const voiceSocket:Ref<Socket | null> = ref(null)
const login = () => {
    if (uname.value.trim() === '') {
        message.error('没有昵称怎么开始啊！')
        return
    }
    const user: CUser = {
        name: uname.value,
        uuid: getUuid(16, 16),
        type: 'user'
    }
    userStore.setMyUser(user)
    voiceSocket.value = getVoiceInstance({
        extraHeaders: {
            authorization: utoa(JSON.stringify(user))
        }
    })
    socket.value = getInstance({
        extraHeaders: {
            authorization: utoa(JSON.stringify(user))
        }
    })
    socket.value.on('message', onRecv)
    socket.value.on('error', onError)
    socket.value.on('disconnect', onClose)
    showModal.value = false
}

const onRecv = (smsg: any) => {
    const { type, data, extra } = smsg;

    if (type === 'message') {
        userStore.addMessage(data)
    } else if (type === 'user-online') {
        userStore.addUser(data)
    } else if (type === 'user-offline') {
        userStore.userOffline(extra)
    }
}
const message = useMessage()
const onError = (err: any) => {
    message.error(err)
    console.log(err)
}

const onClose = (e:any) => {
    console.log(e);
    message.error('连接已断开')
    router.go(0)
}

provide('socket', socket)
provide('voiceSocket', voiceSocket)
</script>

<template>
    <n-modal v-model:show="showModal" :mask-closable="false">
        <n-card class="login-card" :bordered="false" size="huge" role="dialog" aria-modal="true" transform-origin="center">
            <template #header>
                让我们开始吧！
            </template>
            <n-form>
                <n-form-item-row label="先来一个好听的名字">
                    <n-input placeholder="输入昵称" v-model:value="uname" maxlength="8" />
                </n-form-item-row>
            </n-form>
            <div style="display: flex; flex-direction: row-reverse;">
                <n-button type="primary" size="small" @click="login">
                    Let's go!
                </n-button>
            </div>
        </n-card>
    </n-modal>
    <slot></slot>
</template>

<style scoped>
.login-card {
    width: 460px;
    height: fit-content;
}
</style>