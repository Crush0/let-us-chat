<script setup lang="tsx">
import type { CMessage, SMessage } from '@/types/CMessage'
import TimeItem from './chat/TimeItem.vue';
import MessageItem from './chat/MessageItem.vue';
import { ref, type Ref, watch, nextTick } from 'vue';
import Item from './chat/Item.vue';
import type { CUser } from '@/types/CMessage';
interface MLayoutProps {
    messages: CMessage[],
    nowSelect: CUser,
}
const msgContainer: Ref<Element | null> = ref(null)
const props = defineProps<MLayoutProps>()

const renderMsg = ({ msg }: { msg: CMessage }) => {
    if (msg.mtype.name === 'time') {
        return <TimeItem time={msg.time} />
    } else if (msg.mtype.name === 'text' || msg.mtype.name === 'image' || msg.mtype.name === 'audio' || msg.mtype.name === 'video') {
        return <MessageItem message={msg} />
    } else if (msg.mtype.name === 'info') {
        return <Item content={msg.content} />
    }

}

watch(() => props.messages, () => {
    const scrollHeight = msgContainer.value?.scrollHeight
    const height = msgContainer.value?.clientHeight
    const scrollTop = msgContainer.value?.scrollTop

    if (scrollHeight && height && scrollTop) {
        if (scrollHeight - height < 20) {
            updateScroll()
        }
        // 距离底部的高度大于100px时，不滚动
        else if (scrollHeight - height - scrollTop > 100) {
            return
        } else {
            updateScroll()
        }
    }
}, { deep: true })

const updateScroll = () => {
    nextTick(() => {
        msgContainer.value?.scrollTo(0, msgContainer.value?.scrollHeight)
    })
}

// addHandler('message', (data: SMessage) => {
//     if (data.type === 'user-offline') {
//         if (data.extra) {
//             const connectUser:CUser = data.extra;
//             if(connectUser.uuid === props.nowSelect.uuid){
//                 props.messages.push({
//                     mtype: { name: 'info' },
//                     content: '对方已下线'
//                 } as CMessage)
//             }
//         }
//     }
// })

defineExpose({updateScroll})
</script>

<template>
    <div ref="msgContainer" class="msg-container">
        <template v-for="message in props.messages">
            <renderMsg :msg="message"></renderMsg>
        </template>
    </div>
</template>

<style scoped>
.msg-container {
    height: 100%;
    width: 100%;
    padding: 10px;
    overflow: auto;
    scroll-behavior: smooth;
    position: relative;
}
</style>