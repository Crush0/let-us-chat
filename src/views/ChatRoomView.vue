<script lang="ts" setup>
import { ref, computed, type Ref } from 'vue';
import UserCard from '@/components/UserCard.vue'
import My from '@/components/My.vue'
import InputLayout from '@/components/InputLayout.vue';
import { useUserStore } from '@/stores/userConfig';
import type { CMessage, CUser, SMessage } from '@/types/CMessage';
import { useMessage } from 'naive-ui';
import VoiceChat from '@/components/VoiceChat.vue'
import { playNotice } from '@/utils/audioPlay';
import { NEmpty } from 'naive-ui';
import { VoiceEvent } from '@/types/VoiceEnum';
import { MinimizeRound, FullscreenRound,CloseRound } from '@vicons/material'
import { addHandler } from '@/ws/chatSocket';
import { useGolBalConfigStore } from '@/stores/golbalConfig';
const title = ref("Let's talk!")
const messages: Ref<CMessage[]> = ref([])
const message = useMessage()
const userStore = useUserStore()
const userList = computed(() => userStore.getAllUser)
const nowSelect: Ref<CUser> = ref({} as CUser)
const golbalStore = useGolBalConfigStore()
const messageLayout:any = ref(null)
userStore.$onAction(({
    name,
    args,
    after
}) => {
    after(() => {
        if (name === 'addMessage') {
            const msg: CMessage = args[0];
            if (msg.sender.uuid === userStore.getMyUser.uuid && msg.receiver && msg.receiver.uuid === nowSelect.value.uuid) {
                insertMsg(msg)
            } else if (msg.receiver && msg.receiver.uuid === userStore.getMyUser.uuid && msg.sender.uuid === nowSelect.value.uuid) {
                insertMsg(msg)
            } else if (msg.receiver && msg.receiver.type === 'group' && msg.receiver.uuid === nowSelect.value.uuid) {
                insertMsg(msg)
            } else {
                if (msg.receiver?.uuid === '-1') {
                    const group: any = userList.value.find((u: CUser) => u.uuid === msg.receiver?.uuid)
                    if (group) {
                        if (!group.unread) {
                            group.unread = 0
                        }
                        group.unread = group.unread + 1
                    }
                } else {
                    const user: any = userList.value.find((u) => u.uuid === msg.sender?.uuid)
                    if (user) {
                        if (!user.unread) {
                            user.unread = 0
                        }
                        if (msg.mtype.name !== 'info') {
                            user.unread = user.unread + 1
                        }
                    }
                }
                if (msg.mtype.name !== 'info' && golbalStore.getNoticePlay) {
                    playNotice()
                }
            }
        }
    })
})

addHandler('updateUser', (data:SMessage) => {
    console.log(data);
    
    userStore.updateUser(data.data)
})

const checkTime = (msg0: CMessage, msg1: CMessage) => {
    return new Date(msg0.time).getTime() - new Date(msg1.time).getTime() > 1000 * 60 * 5
}

const insertMsg = (msg: CMessage) => {
    const lastMsg: CMessage = messages.value[messages.value.length - 1]
    const timeMsg: CMessage = {
        ...msg,
        mtype: {
            name: 'time'
        },
        time: msg.time,
        content: ''
    }
    if (lastMsg) {
        if (checkTime(lastMsg, msg)) {
            messages.value.push(timeMsg)
        }
    } else {
        messages.value.push(timeMsg)
    }
    messages.value.push(msg)
    setTimeout(() => {
        messages.value.sort((a: CMessage, b: CMessage) => {
            return new Date(a.time).getTime() - new Date(b.time).getTime()
        })
    })
}

const userSelect = (_: any, user_: CUser) => {
    if (nowSelect.value?.uuid === user_.uuid) return;
    if (user_.uuid) {
        const user = userStore.getUserByUUID(user_.uuid)
        if (user) {
            title.value = user.name
            nowSelect.value = user
            messages.value = [];
            user.unread = 0
            userStore.getUserMsg(nowSelect.value).forEach((msg: CMessage) => {
                insertMsg(msg)
                // if (msg.receiver && msg.receiver.uuid === userStore.getMyUser.uuid) {
                //     insertMsg(msg)
                // } else if (nowSelect.value.uuid === '-1' && msg.receiver && msg.receiver.uuid === '-1') {
                //     insertMsg(msg)

                // }
            })
        }

    }

}

const voiceChat: any = ref(null)
const group = ref(userStore.getUserByUUID('-1'))
const unread = computed(() => {
    if (group.value && group.value.unread) {
        return group.value.unread
    } else {
        return 0
    }
})

const chatUser: Ref<CUser | null> = ref({
    uuid: '-1000',
    name: '未知用户',
    type: 'user'
})

const onCallSend = (user: CUser) => {
    if (chatUser.value?.uuid === '-1000') {
        chatUser.value = user
        voiceChat.value?.show()
        voiceChat.value?.startChat(VoiceEvent.initiateCall, {
            sender: userStore.getMyUser,
            receiver: chatUser.value
        })
    } else {
        message.error('有未处理的通话，无法开启新的通话')
    }

}
const window_:any = window
const minimize = () => {
    window_.windowSize.minimize()
}

const fullScreen = () => {
    window_.windowSize.maxsize()
}

const closeWin = () => {
    window_.windowSize.close()
}

</script>

<template>
    <VoiceChat ref="voiceChat" v-model:user="chatUser" />
    <div class="chat-room-view">
        <div class="header">
            <div class="menu-circle"></div>
            <div class="menu-title">
                {{ title }}<span v-if="nowSelect.type !== 'group'" style="font-size: 12px; color:#666 ">#{{ nowSelect.uuid?.slice(0,4) }}</span>
            </div>
            <div class="win-btn-group" v-if="window_.windowSize">
                <div class="win-btn">
                    <n-button circle size="tiny" type="primary" @click="minimize">
                        <template #icon>
                            <n-icon>
                                <MinimizeRound />
                            </n-icon>
                        </template>
                    </n-button>
                </div>
                <div class="win-btn">
                    <n-button circle size="tiny" type="primary" @click="fullScreen">
                        <template #icon>
                            <n-icon>
                                <FullscreenRound />
                            </n-icon>
                        </template>
                    </n-button>
                </div>
                <div class="win-btn">
                    <n-button circle size="tiny" type="error" @click="closeWin">
                        <template #icon>
                            <n-icon>
                                <CloseRound />
                            </n-icon>
                        </template>
                    </n-button>
                </div>
            </div>
        </div>
        <div class="wrapper">
            <div class="left-side">
                <div class="side-wrapper">
                    <div class="side-menu">
                        <a href="#" :class="{ active: nowSelect.uuid === '-1' }" @click="userSelect($el, {
                            uuid: '-1',
                            name: '大家的聊天室',
                            type: 'group'
                        })">
                            <svg viewBox="0 0 512 512">
                                <g xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                    <path
                                        d="M0 0h128v128H0zm0 0M192 0h128v128H192zm0 0M384 0h128v128H384zm0 0M0 192h128v128H0zm0 0"
                                        data-original="#bfc9d1" />
                                </g>
                                <path xmlns="http://www.w3.org/2000/svg" d="M192 192h128v128H192zm0 0" fill="currentColor"
                                    data-original="#82b1ff" />
                                <path xmlns="http://www.w3.org/2000/svg"
                                    d="M384 192h128v128H384zm0 0M0 384h128v128H0zm0 0M192 384h128v128H192zm0 0M384 384h128v128H384zm0 0"
                                    fill="currentColor" data-original="#bfc9d1" />
                            </svg>
                            大家的聊天室
                            <div class="updates">
                                <span v-if="unread > 0" class="notification-number">{{ unread > 99 ? '99+' : unread
                                }}</span>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="side-wrapper" style="height: calc(100% - 160px);">
                    <div class="side-title">用户列表</div>
                    <template v-if="userList.length > 1">
                        <template v-for="user in userList" :key="user.uuid">
                            <UserCard v-if="user.type === 'user'" :unread="user.unread" :online="user.online" :avatar="user.avatar"
                                :uuid="user.uuid"
                                :new-msg="user.messages ? user.messages[user.messages?.length - 1] : {} as CMessage"
                                :username="user.name" :active="nowSelect.uuid === user.uuid" @click="userSelect($el, user)">
                            </UserCard>
                        </template>
                    </template>
                    <template v-else>
                        <n-empty style="margin-top: 50px;" description="这里还没有小伙伴"/>
                    </template>
                </div>
                <div class="side-wrapper side-my">
                    <My />
                </div>

            </div>
            <div class="main-container">
                <MessageLayout ref="messageLayout" :messages="messages" :nowSelect="nowSelect" />
                <InputLayout :receiver="nowSelect" @onCallSend="onCallSend" @submit="messageLayout?.updateScroll" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.chat-room-view {
    /* width: 65vw; */
    /* height: 80vh; */
    display: flex;
    width: 100vw;
    height: 100vh;
    flex-direction: column;
}

.header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-shrink: 0;
    height: 58px;
    width: 100%;
    border-bottom: 1px solid var(--border-color);
    padding: 0 30px;
    white-space: nowrap;
    -webkit-app-region: drag;
    z-index: 9999;
}
.header .win-btn-group{
    z-index: 9999;
    display: flex;
    flex-direction: row;
    width: 80px;
    justify-content: center;
    position: absolute;
    right: 10px;
}
.header .win-btn-group .win-btn{
    margin: 0 4px;
    z-index: 9999;
}
.header .win-btn-group .win-btn:first-child:deep(.n-icon) {
    bottom: 4px;
}

@media screen and (max-width: 480px) {
    .header {
        padding: 0 16px;
    }
}


.menu-circle {
    width: 15px;
    height: 15px;
    background-color: #f96057;
    border-radius: 50%;
    box-shadow: 24px 0 0 0 #f8ce52, 48px 0 0 0 #5fcf65;
    margin-right: 195px;
    flex-shrink: 0;
    z-index: 9999;
}

.updates {
    position: relative;
    top: 0;
    right: 0;
    margin-left: auto;
    width: 18px;
    height: 18px;
    font-size: 11px;
}

.side-my {
    display: flex;
    width: 100%;
    height: 70px;
    align-items: center;
    justify-content: center;
}

.notification-number {
    position: absolute;
    background-color: rgb(247, 76, 49);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    right: -2px;
}

@media screen and (max-width: 945px) {
    .menu-circle {
        display: none;
    }
}

.menu-title {
    color: rgba(255, 255, 255, 0.87);
    font-size: 120%;
    user-select: none;
    text-indent: 3rem;
}

.wrapper {
    display: flex;
    flex-grow: 1;
    height: calc(100% - 58px);
    overflow: hidden;
}

.left-side {
    flex-basis: 240px;
    border-right: 1px solid var(--border-color);
    padding: 26px;
    overflow: auto;
    flex-shrink: 0;
}

.side-wrapper+.side-wrapper {
    overflow: auto;
    margin-top: 20px;
}

.side-title {
    color: var(--inactive-color);
    font-size: 80%;
    margin-bottom: 14px;
}

.side-menu {
    display: flex;
    flex-direction: column;
    white-space: nowrap;
}

.side-menu a {
    text-decoration: none;
    color: var(--theme-color);
    display: flex;
    align-items: center;
    font-weight: 400;
    padding: 10px;
    font-size: 14px;
    border-radius: 6px;
    transition: 0.3s;
}

.side-menu a:hover,
.side-menu a.active {
    background-color: var(--hover-menu-bg);
}

.side-menu svg {
    width: 16px;
    margin-right: 8px;
}

@media screen and (max-width: 945px) {
    .left-side {
        display: none;
    }
}

.main-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: calc(100% - 240px);
}
</style>