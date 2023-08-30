<script setup lang="ts">
import { useUserStore } from '@/stores/userConfig';
import type { CMessage, CUser } from '@/types/CMessage';
import { useMessage } from 'naive-ui';
import type { Socket } from 'socket.io-client';
import { computed, inject, ref, type Ref } from 'vue';
import emoji from './bar/emoji.vue';
import voice from './bar/voice.vue'
const emits = defineEmits(['onCallSend', 'submit'])
const props = defineProps({
    receiver: {
        type: Object as () => CUser,
        required: true
    }
});
const processCilpBoard = () => {
    window.navigator.clipboard.read().then(async (clipboardItems:
        ClipboardItem[]) => {
        const clipboardItem = clipboardItems[0];
        console.log(clipboardItem);
        
        if (clipboardItem) {
            const type = clipboardItem.types[0];
            if (type.includes('image')) {       
                const blob = await clipboardItem.getType('image/png')
                submitMsg(blob)
            }
        }
    })
}
const submit = (e: SubmitEvent | KeyboardEvent | Event) => {
    if (e instanceof SubmitEvent) {
        submitMsg(messageContent.value)
    }
    else if (e instanceof KeyboardEvent && e.ctrlKey && e.key == 'v') {
        // 
        processCilpBoard()
    }
    else if (e instanceof KeyboardEvent && !e.shiftKey && e.key == 'Enter') {
        submitMsg(messageContent.value)
        setTimeout(() => {
            messageContent.value = ''
        }, 5)
    }
    else if (e instanceof KeyboardEvent && e.key == '@') {
        console.log('@');
        // TODO 实现输入@弹出用户选择框
    }
}

const socket: Ref<Socket | undefined> = ref(inject('socket'))
const message = useMessage()
const form: Ref<HTMLFormElement | null> = ref(null)
const textarea: Ref<any | null> = ref(null)
const messageContent = ref('')
const userStore = useUserStore()
const submitMsg = (content: string | Blob) => {
    if (!props.receiver.uuid) {
        message.error('你要发给谁啊?');
        return;
    }

    if (props.receiver.type === 'user' && !props.receiver.online) {
        message.error('他已经下线了喂!')
        return;
    }
    if (content instanceof Blob) {
        submitImage(content)
    } else {
        submitMessage(content)
    }
    emits('submit')
}

const submitImage = (content: Blob) => {
    const msg: CMessage = {
        sender: userStore.getMyUser,
        receiver: {
            ...props.receiver,
            messages: [] as CMessage[]
        },
        time: new Date(),
        content,
        mtype: {
            name: 'image'
        }
    };
    if (socket.value) {
        socket.value.emit('msg', {
            type: 'message',
            data: msg
        });
    } else {
        message.error('好像忘了初始化了，要不你刷新试试?');
    }
    userStore.addMessage(msg);
}

const submitMessage = (content: string) => {
    if (content.trim() == '') {
        message.error('你要发啥啊?');
        return;
    }

    const msg: CMessage = {
        sender: userStore.getMyUser,
        receiver: {
            ...props.receiver,
            messages: [] as CMessage[]
        },
        time: new Date(),
        content,
        mtype: {
            name: 'text'
        }
    };
    if (socket.value) {
        socket.value.emit('msg', {
            type: 'message',
            data: msg
        });
    } else {
        message.error('好像忘了初始化了，要不你刷新试试?');
    }
    userStore.addMessage(msg);
    messageContent.value = ''
}

const layoutActive = computed(() => {
    return messageContent.value.trimStart().length !== 0
})
const onEmojiSelect = (emojiText: string) => {
    messageContent.value += emojiText
}
const onCallSend = () => {
    if (!props.receiver.uuid) {
        message.error('你要发给谁啊?');
        return;
    }

    if (props.receiver.type === 'user' && !props.receiver.online) {
        message.error('他已经下线了喂!')
        return;
    }
    emits('onCallSend', props.receiver)
}
</script>

<template>
    <div class="input-layout">
        <div class="extra-bar">
            <div class="extra-bar-item">
                <emoji @onSelect="onEmojiSelect" />
                
            </div>
            <div v-if="receiver.type !== 'group'" class="extra-bar-item" @click="onCallSend">
                <voice />
            </div>
        </div>
        <form ref="form" @submit.prevent="submit" @mouseenter="textarea.focus()">
            <textarea maxlength="1000" @keydown="submit" :class="{ active: layoutActive }"
                :style="{ height: '100px' }" v-model="messageContent"
                ref="textarea" class="textarea" placeholder="Let's talk.(将图片粘贴到此处以发送图片)" type="text" name="name" autocomplete="none" />
            <n-button class="submit-button" strong secondary color="#8a2be2" attr-type="submit">
                发送
            </n-button>
        </form>
    </div>
</template>

<style scoped>
.input-layout {
    padding: 0 10px;
    background-color: rgba(40, 44, 52, 0.23);
}

.input-layout .extra-bar .extra-bar-item {
    margin: 0 5px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.input-layout .extra-bar .extra-bar-item:hover {
    background-color: rgb(42 46 60 / 94%);
}

.input-layout .extra-bar {
    display: flex;
    width: 100%;
    padding: 0 5px;
    height: 30px;
    margin: 5px 0;
    background-color: rgb(90 94 109 / 64%);
    ;
    border-radius: 8px;
    flex-direction: row;
    align-items: center;
}

.submit-button {
    transform: translateY(60px);
    opacity: 0;
    transition: all 0.3s;
}

.input-layout form {
    cursor: text;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
}

.input-layout form .textarea {
    outline: none;
    border: none;
    height: 30px;
    padding: 5px 10px;
    background-color: transparent;
    border-radius: 4px;
    font-size: 14px;
    width: 100%;
    resize: none;
    color: var(--theme-color);
    transition: height 0.3s;
}

.input-layout form .textarea.active+.submit-button {
    transform: translateY(0);
    opacity: 1;
}
</style>