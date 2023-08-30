<script setup lang="tsx">
import { onMounted, provide, ref, type Ref } from 'vue'
import { getInstance } from '@/ws/chatSocket';
import { useUserStore } from '@/stores/userConfig';
import type { CUser } from '@/types/CMessage';
import type { Socket } from 'socket.io-client';
import { getUuid } from '@/utils/uuid';
import { utoa } from '@/utils/encode';
import { useMessage, type SelectOption } from 'naive-ui';
import { getVoiceInstance } from '@/ws/voiceSocket';
import { avatars, getAvatarFile } from '@/utils/header';
// import { useRouter } from 'vue-router';
const userStore = useUserStore()
const showModal = ref(true)
const uname = ref('')
// const router = useRouter()
const socket: Ref<Socket | null> = ref(null)
const voiceSocket: Ref<Socket | null> = ref(null)
const login = () => {
    if (uname.value.trim() === '') {
        message.error('没有昵称怎么开始啊！')
        return
    }
    const user: CUser = {
        name: uname.value,
        uuid: getUuid(16, 16),
        type: 'user',
        avatar: selectedValue.value
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

const onClose = (e: any) => {
    console.log(e);
    message.error('连接已断开')
    setTimeout(() => {
        window.location.reload()
    }, 1000)
    // router.go(0)
}

provide('socket', socket)
provide('voiceSocket', voiceSocket)
const toEle: any = ref(null)
onMounted(() => {
    toEle.value = document.querySelector('.chat-room-view .wrapper')
})
const selectedValue:Ref<string> = ref('')
const options:Ref<Array<SelectOption>> = ref([])
const renderLabel = (option:SelectOption) => {
    return <div class="option-label">
        <img width={30} height={30} src={getAvatarFile(option.value).href}/>
        <span>{option.label}</span>
    </div>
}
onMounted(() => {
    avatars.forEach((avatar) => {
        options.value.push({
            value: avatar,
            label: avatar
        })
    })
    selectedValue.value = avatars[Math.floor(Math.random() * avatars.length) | 0]
})

</script>

<template>
    <n-modal v-model:show="showModal" :mask-closable="false" :to="toEle">
        <n-card class="login-card" :bordered="false" size="huge" role="dialog" aria-modal="true" transform-origin="center">
            <template #header>
                让我们开始吧！
            </template>
            <n-form>
                <n-form-item-row label="先来一个好听的名字">
                    <n-input placeholder="输入昵称" v-model:value="uname" maxlength="8" />
                </n-form-item-row>
                <n-form-item-row label="再选一个中意的头像">
                    <n-select v-model:value="selectedValue" :render-label="renderLabel" filterable placeholder="选择歌曲" :options="options" />
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
.login-card:deep(.option-label){
    display: flex;
    flex-direction: row;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    /* justify-content: center; */
}
.login-card:deep(.option-label span){
    margin-left: 5px;
}
</style>