<script setup lang="ts">
import timeFotmat from '@/utils/timeFormat'
import type { CMessage, CUser, Mtype } from '@/types/CMessage';
import { Trash } from '@vicons/ionicons5';
import { Icon } from '@vicons/utils';
import { getAvatarFile } from '@/utils/header';
import { useDialog } from 'naive-ui';
import { useUserStore } from '@/stores/userConfig';
interface UserCardProps {
    username: string,
    uuid: string,
    active: boolean,
    unread: number,
    newMsg: CMessage,
    online: boolean,
    avatar: string
}

const props = withDefaults(defineProps<UserCardProps>(), {
    username: 'Unknown',
    active: false,
    online: false,
    unread: 0,
    uuid: '',
    avatar: '',
    newMsg: () => ({
        sender: {
            name: '',
            uuid: ''
        } as CUser,
        time: new Date(),
        mtype: {
            name: 'text'
        } as Mtype

    })
})
const dialog = useDialog()
const userStore = useUserStore()
const deleteUser = () => {
    dialog.warning({
          title: '警告',
          content: '你确定要删除该离线用户吗，所有的历史记录将被删除',
          positiveText: '确定',
          negativeText: '再等等',
          onPositiveClick: () => {
            userStore.removeUser({
                uuid: props.uuid,
            } as CUser)
          },
        })
}

</script>

<template>
    <div class="side-menu">
        <a href="javascript:void(0);" class="menu-item" :class="{ active }">
            <n-avatar size="small" :class="{ offline: !props.online }" class="avatar"
                :src="getAvatarFile(props.avatar).href" :render-fallback="() => props.username.slice(0, 2)" />
            <div class="desc">
                <span class="uname">{{ props.username }}<span class="uuid">#{{ props.uuid.slice(0, 4) }}</span></span>
                <span class="content">{{ newMsg.content && newMsg.mtype.name === 'text' ? newMsg.content :
                    (newMsg.mtype.name === 'image' ? '[图片]' : '&nbsp;') }}</span>
            </div>
            <div class="updates">
                <span v-if="newMsg.time" class="time">{{ timeFotmat.getLastChatTime(newMsg.time) }}</span>
                <span v-if="unread > 0" class="notification-number">{{ unread > 99 ? '99+' : unread }}</span>
                <n-button @click.stop="deleteUser" v-if="!props.online" class="trash-icon" type="error" quaternary round>
                    <template #icon>
                        <n-icon>
                            <Trash />
                        </n-icon>
                    </template>
                </n-button>
            </div>
        </a>
    </div>
</template>

<style scoped>
.menu-item {
    height: 100%;
}

.side-menu {
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    margin: 5px;
    height: 60px;
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

.uuid {
    color: #666;
    font-size: 8px;
}

.offline {
    filter: grayscale(1);
}

.trash-icon {
    position: absolute;
    top: 5px;
    right: 10px;
    width: 30px;
    height: 30px;
}

.side-menu a:hover,
.side-menu a.active {
    background-color: var(--hover-menu-bg);
}

.side-menu svg {
    width: 16px;
    margin-right: 8px;
}

.desc {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.uname {
    margin-left: 8px;
    font-size: 12px;
    max-width: 60px;
    /** 超出省略号 */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.content {
    margin-left: 8px;
    color: var(--inactive-color);
    font-size: 12px;
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
    top: 10px;
}

.time {
    position: absolute;
    right: -2px;
    top: -10px;
    color: var(--inactive-color);
}

.updates {
    position: relative;
    top: 0;
    right: 0;
    margin-left: auto;
    width: 18px;
    height: 18px;
    font-size: 11px;
}</style>