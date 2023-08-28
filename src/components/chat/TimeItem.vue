<script setup lang="ts">
import timeFormat from '@/utils/timeFormat';
const props = defineProps<{time: Date | string}>()
</script>

<template>
    <div class="time-item" v-html="timeFormat.getHistoryChatTime(typeof props.time === 'string' ? new Date(props.time) : props.time)"/>
</template>

<style scoped>
.time-item{
    width: 100px;
    background-color: var(--content-bg);
    color: var(--theme-color);
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    border-radius: 4px;
    cursor: default;
    user-select: none;
    margin: 10px auto;
}
</style>