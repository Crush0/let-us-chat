<script setup lang="ts">
import { Icon } from '@vicons/utils'
import { Call } from '@vicons/ionicons5'
</script>

<template>
    <div class="voice">
        <Icon>
            <Call />
        </Icon>
    </div>
</template>

<style scoped>
.voice {
    position: relative;
    user-select: none;
    width: 25px;
    text-align: center;
    height: 100%;
}
</style>