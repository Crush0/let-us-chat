<script setup lang="ts">
// @ts-ignore
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
// @ts-ignore
import { Icon } from '@vicons/utils'
import { HappySharp } from '@vicons/ionicons5'
import { ref, } from 'vue';
const emit = defineEmits(['onSelect'])
const onSelectEmoji = (data: any) => {
    emit('onSelect', data.i)
}
const emojiVisible = ref(false)
</script>

<template>
    <div class="emoji-picker" @click="emojiVisible = !emojiVisible">
        <Icon >
            <HappySharp />
        </Icon>
        <div class="picker">
            <Transition>
                <EmojiPicker @mouseleave="emojiVisible = false" v-show="emojiVisible" :disable-skin-tones="true"
                    :disable-sticky-group-names="true" :hide-search="true" :display-recent="false" :offset="-300"
                    :native="true" theme="dark" @select="onSelectEmoji" />
            </Transition>
        </div>
    </div>
</template>

<style scoped>
.emoji-picker {
    position: relative;
    user-select: none;
    width: 25px;
    text-align: center;
    height: 100%;
}

.picker {
    position: absolute;
    bottom: 150%;
}

.picker:deep(.v3-footer) {
    display: none;
}

.picker:deep(.v3-emoji-picker .v3-body .v3-body-inner .v3-group .v3-emojis button span) {
    color: var(--v3-picker-fg);
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>