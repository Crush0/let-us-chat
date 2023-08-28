<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps(['value', 'maxHeight', 'placehloder'])
const inputDiv = ref(null)
function keepLastIndex(obj: any) {
    obj.focus();
    var range = window.getSelection();
    if (range) {
        range.selectAllChildren(obj);
        range.collapseToEnd();
    }
}
const scrollToBottom = (target: any) => {
	target.scrollTop = target.scrollHeight;
}
const emits = defineEmits(['update:value'])
const onInput = (e: Event) => {
    e.preventDefault();
    if (e instanceof InputEvent) {
        const { target, inputType } = e;
        // if(inputType === 'insertFromPaste'){
        //     setTimeout(() => {
        //         keepLastIndex(target)
        //     })
        // }
        // @ts-ignore
        emits('update:value', target.innerHTML)
        setTimeout(() => {
            scrollToBottom(target)
        },2)
    }
}

const focus = () => {
    keepLastIndex(inputDiv.value)
}
defineExpose({ focus })
</script>

<template>
    <div ref="inputDiv" class="input-content" :style="{ maxHeight: props['maxHeight'] + 'px' }" contenteditable
        @input.naive="onInput" :placeholder="props.placehloder">
    
    </div>
</template>

<style>
.input-content {
    overflow: auto;
}

div[contenteditable]:empty:before {
    content: attr(placeholder);
    color: #a1a1a1;
}

div[contenteditable]:focus {
    content: none;
}
</style>