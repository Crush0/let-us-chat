<script setup lang="ts">
import timeFotmat from '@/utils/timeFormat'
import type { CMessage, CUser, Mtype } from '@/types/CMessage';
import { Trash } from '@vicons/ionicons5';
import { Icon } from '@vicons/utils';
interface UserCardProps {
    username: string,
    uuid: string,
    active: boolean,
    unread: number,
    newMsg: CMessage,
    online: boolean
}

const props = withDefaults(defineProps<UserCardProps>(), {
    username: 'Unknown',
    active: false,
    online: false,
    unread: 0,
    uuid: '',
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

</script>

<template>
    <div class="side-menu">
        <a href="javascript:void(0);" class="menu-item" :class="{ active }">
            <n-avatar size="small" :class="{ online: props.online }" class="avatar">
                {{ props.username.slice(0, 2) }}
            </n-avatar>
            <div class="desc">
                <span class="uname">{{ props.username }}<span class="uuid">#{{ props.uuid.slice(0, 4) }}</span></span>
                <span class="content">{{ newMsg.content && newMsg.mtype.name === 'text' ? newMsg.content : (newMsg.mtype.name === 'image'? '[图片]': '&nbsp;') }}</span>
            </div>
            <div class="updates">
                <span v-if="unread > 0" class="time">{{ timeFotmat.getLastChatTime(newMsg.time) }}</span>
                <span v-if="unread > 0" class="notification-number">{{ unread > 99 ? '99+' : unread }}</span>
            </div>
        </a>
    </div>
</template>

<style scoped>
.menu-item{
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
.uuid{
    color: #666;
    font-size: 8px;
}

.online {
    background-color: green;
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