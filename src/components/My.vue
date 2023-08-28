<script setup lang="ts">
import { useUserStore } from '@/stores/userConfig';
import { computed } from 'vue';
import { SettingsOutline } from '@vicons/ionicons5';
import { Icon } from '@vicons/utils';
const userStore = useUserStore()

const myUser = computed(() => userStore.getMyUser)

</script>

<template>
        <div class="my">
            <template v-if="myUser.name !== ''">
                <n-avatar>{{ myUser.name.slice(0, 2) }}</n-avatar>
                <span class="uname">{{ myUser.name }}</span>
                <Icon class="settings">
                    <SettingsOutline/>
                </Icon>
            </template>
        </div>
</template>

<style scoped>
.my {
    width: fit-content;
    height: 80%;
    display: flex;
    align-items: center;
    flex-direction: row;
    user-select: none;
    padding: 2px 8px;
    transition: all 0.3s;
    border-radius: 8px;
    cursor: pointer;
}
.settings{
    width: 20px;
    height: 20px;
    display: flex;
    margin-left: 10px;
    padding: 2px;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
}
.settings:hover{
    background-color: var(--content-title-color);
    transform: rotate(45deg);
}
.my:hover {
    background-color: var(--hover-menu-bg);
}

.uname {
    margin-left: 10px;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>