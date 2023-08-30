<script setup lang="tsx">
import { useUserStore } from '@/stores/userConfig';
import type { CMessage } from '@/types/CMessage';
import MessageMenu from '@/components/MessageMenu.vue'
import { computed, ref, type Ref } from 'vue';
import useClipboard from 'vue-clipboard3';
import { useMessage } from 'naive-ui';
const { toClipboard } = useClipboard();
import { useDialog } from 'naive-ui'
const message = useMessage()
import { NImage } from 'naive-ui';
import { getAvatarFile } from '@/utils/header';
interface MessageItemProps {
    message: CMessage
}

const props = defineProps<MessageItemProps>()
const userStore = useUserStore()

const myUser = userStore.getMyUser
const messageMenu: Ref<any> = ref(null)
const isMineMsg = computed(() => props.message.sender.uuid === myUser.uuid)
const openMenu = (event: MouseEvent) => {
    if (event instanceof PointerEvent) {
        const { clientX, clientY } = event
        messageMenu.value?.show(clientX, clientY)
    }
}

const renderMsg = (props: any) => {
    if (typeof props.content === 'object') {
        const url = URL.createObjectURL(new Blob([props.content], { type: 'image/png' }));
        return <NImage
            width="100"
            src={url}
        />
    } else {
        return <span>{props.content}</span>
    }
}

const copy = async () => {
    // 复制到剪切板
    if (props.message.content) {
        if (typeof props.message.content === 'string') {
            await toClipboard(props.message.content)
            message.success('已复制到剪切板')
        } else {
            await window.navigator.clipboard.write([
                new ClipboardItem({
                    ['image/png']: props.message.content
                })
            ]);
            message.success('已复制到剪切板')
        }

    }


}
const dialog = useDialog()
const deleteMsg = () => {
    dialog.warning({
        title: '删除消息',
        content: '确定要删除该消息吗？该消息只会在你的本地被删除。',
        positiveText: '删除',
        negativeText: '算了',
        transformOrigin: 'center',
        onPositiveClick: () => {
            props.message.mtype.name = 'delete'
        }
    })
}
</script>

<template>
    <div :class="{ 'mine': isMineMsg }" class="message-item">
        <n-avatar class="avatar" round size="small" :src="getAvatarFile(props.message.sender.avatar).href" :render-fallback="() => props.message.sender.name.slice(0, 2)"/>
        <div class="wapper">
            <div class="uname">
                {{ props.message.sender.name }}<span class="uid">#{{ props.message.sender.uuid?.slice(0, 4) }}
                </span>
            </div>
            <div class="message-content" @contextmenu.prevent.stop="openMenu">
                <renderMsg :content="props.message.content" />
            </div>
        </div>
    </div>
    <MessageMenu ref="messageMenu" @copy="copy" @delete="deleteMsg" />
</template>

<style scoped>
.message-item {
    display: flex;
    width: 100%;
    margin: 10px 0;
    transition: all 0.3s;
    cursor: default;
}

.message-content:hover {
    background-color: var(--inactive-color) !important;
}

.mine {
    flex-direction: row-reverse
}

.mine .wapper {
    align-items: flex-end;
}

.mine .wapper .message-content {
    background-color: rgba(40, 44, 52, 0.66);
    transition: all 0.3s;
    white-space: pre-wrap;

}

.wapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: calc(100% - 30px);
}

.uname {
    color: var(--theme-color);
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
}

.message-content {
    background-color: var(--overlay-bg);
    color: var(--theme-color);
    border-radius: 4px;
    margin-left: 5px;
    margin-right: 5px;
    padding: 5px 10px;
    max-width: 100%;
    word-wrap: break-word;
}

.uid {
    color: #666;
    font-size: 8px;
}
</style>