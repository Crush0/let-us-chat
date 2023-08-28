<script setup lang="ts">
interface newBrandProps{
    show: boolean,
    count: number,
    color: string
}

const props = withDefaults(defineProps<newBrandProps>(), {
    show: false,
    count: 0,
    color: 'red'
})
</script>

<template>
    <div class="new-brand-container" v-show="props.show">

    </div>
</template>

<style scoped>
.new-brand-container{
    position: absolute;
    width: 40px;
    height: 60px;
}
</style>