<script setup lang="ts">
const props = defineProps<{content: string | Blob | undefined}>()
</script>

<template>
    <div class="item" v-html="props.content"/>
</template>

<style scoped>
.item{
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