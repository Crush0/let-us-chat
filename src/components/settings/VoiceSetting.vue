<script lang="ts" setup>
import { useGolBalConfigStore } from '@/stores/golbalConfig';
import { ref, watch } from 'vue';
const golbalConfig = useGolBalConfigStore()
const settingsModel = ref({
    noticePlay: golbalConfig.getNoticePlay
})
watch(() => settingsModel.value.noticePlay, (newValue) => {
    golbalConfig.setNoticePlay(newValue)
})
</script>

<template>
    <div class="voice-setting">
        <n-form :model="settingsModel" label-placement="left" label-width="auto">
            <n-form-item label="消息提示音" path="noticePlay">
                <n-switch v-model:value="settingsModel.noticePlay" />
            </n-form-item>
        </n-form>
    </div>
</template>

<style scoped>
.voice-setting{
    padding: 10px;
}
</style>