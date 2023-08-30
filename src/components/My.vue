<script setup lang="ts">
import { useUserStore } from '@/stores/userConfig';
import { computed, ref } from 'vue';
import { SettingsOutline } from '@vicons/ionicons5';
import { Icon } from '@vicons/utils';
import { getAvatarFile } from '@/utils/header';
import Settings from './Settings.vue';
const userStore = useUserStore()

const myUser = computed(() => userStore.getMyUser)
const visible = ref(false)
</script>

<template>
    <Settings v-model:show="visible"/>
    <div class="my">
        <template v-if="myUser.name !== ''">
            <n-avatar round
                :src="getAvatarFile(myUser.avatar).href"
                :render-fallback="() => myUser.name.slice(0, 2)" />
            <span class="uname">{{ myUser.name }}</span>
            <Icon class="settings" @click="visible = !visible">
                <SettingsOutline />
            </Icon>
        </template>
    </div>
</template>

<style scoped>
.my {
    width: 100%;
    max-width: 180px;
    height: 80%;
    display: flex;
    align-items: center;
    flex-direction: row;
    user-select: none;
    padding: 2px 8px;
    transition: all 0.3s;
    border-radius: 8px;
    justify-content: center;
    background: rgba(12 15 25 / 30%);
}

.my:deep(.n-avatar){
    align-items: center;
    justify-content: center;
}

.settings {
    width: 20px;
    height: 20px;
    display: flex;
    margin-left: 10px;
    padding: 2px;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
    cursor: pointer;
}

.settings:hover {
    background-color: var(--content-title-color);
    transform: rotate(45deg);
}

/* .my:hover {
    background-color: var(--hover-menu-bg);
} */

.uname {
    margin-left: 10px;
    max-width: calc(100% - 76px);
    /* 超出省略号 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}</style>