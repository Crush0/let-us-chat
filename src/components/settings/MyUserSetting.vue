<script lang="tsx" setup>
import type { SelectOption } from 'naive-ui';
import { inject, onMounted, ref, type Ref } from 'vue';
import { avatars, getAvatarFile } from '@/utils/header';
import { useUserStore } from '@/stores/userConfig';
import type { CUser, SMessage } from '@/types/CMessage';
// @ts-ignore
import * as _ from 'loadsh'
const uname = ref('')
const selectedValue = ref('')
const renderLabel = (option: SelectOption) => {
    return <div class="option-label">
        <img width={30} height={30} src={getAvatarFile(option.value).href} />
        <span>{option.label}</span>
    </div>
}
const userStore = useUserStore()
const options: Ref<Array<SelectOption>> = ref([])
onMounted(() => {
    avatars.forEach((avatar) => {
        options.value.push({
            value: avatar,
            label: avatar
        })
    })
    if (userStore.getMyUser.avatar) {
        selectedValue.value = userStore.getMyUser.avatar
    }
    uname.value = userStore.getMyUser.name
})
const chatSocket:any = inject('socket')
const updateUser = _.debounce(() => {
    userStore.updateMyUser({
        name: uname.value,
        avatar: selectedValue.value
    } as CUser)
    chatSocket.value.emit('updateUser', {
        type: 'updateUser',
        data: userStore.getMyUser
    } as SMessage)
}, 1000, {
  'leading': true,
  'trailing': false
})
</script>

<template>
    <div class="login-card">
        <n-form>
            <n-form-item-row label="我的ID（不可更换）">
                <n-input placeholder="我的ID" v-model:value="userStore.getMyUser.uuid" maxlength="8" disabled/>
            </n-form-item-row>
            <n-form-item-row label="要换一个好听的名字吗">
                <n-input placeholder="输入昵称" v-model:value="uname" maxlength="8" />
            </n-form-item-row>
            <n-form-item-row label="要换一个中意的头像吗">
                <n-select v-model:value="selectedValue" :render-label="renderLabel" filterable placeholder="选择歌曲"
                    :options="options" />
            </n-form-item-row>
        </n-form>
        <div style="display: flex; flex-direction: row-reverse;">
            <n-button type="primary" size="small" @click="updateUser">
                完成
            </n-button>
        </div>
    </div>
</template>

<style scoped>
.login-card {
    width: 100%;
    height: fit-content;
}

.login-card:deep(.option-label) {
    display: flex;
    flex-direction: row;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    /* justify-content: center; */
}

.login-card:deep(.option-label span) {
    margin-left: 5px;
}
</style>