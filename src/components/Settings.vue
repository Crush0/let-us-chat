<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import MyUserSetting from './settings/MyUserSetting.vue';
import VoiceSetting from './settings/VoiceSetting.vue';
const emits = defineEmits(['update:show'])
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})
const isShow = ref(props.show)

watch(() => isShow.value, (newVal) => {
    emits('update:show', newVal)
})
watch(() => props.show, (newVal) => {
    isShow.value = newVal
})
const toEle: any = ref(null)
onMounted(() => {
    toEle.value = document.querySelector('.chat-room-view .wrapper')
})
</script>

<template>
    <n-modal v-model:show="isShow" :to="toEle">
        <n-card title="设置" class="settings-card">
            <n-tabs type="line" animated>
                <n-tab-pane name="oasis" tab="我的">
                    <MyUserSetting/>
                </n-tab-pane>
                <n-tab-pane name="the beatles" tab="声音设置">
                    <VoiceSetting/>
                </n-tab-pane>
            </n-tabs>
        </n-card>
    </n-modal>
</template>

<style scoped>
.settings-card{
    width: 30vw;
}
</style>