<script setup lang="ts">
import { NIcon } from 'naive-ui';
import { ref, type Component, h } from 'vue';
import { Copy, Trash } from '@vicons/ionicons5';
const emits = defineEmits(['copy', 'delete'])
function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}
const x = ref(0)
const y = ref(0)
const isShow = ref(false)
const messageMenu: any = ref(null)
const show = (x_: number, y_: number) => {
    const width = 80;
    if (width + x_ > window.innerWidth) x_ = window.innerWidth - width;
    x.value = x_;
    y.value = y_;
    isShow.value = true;

    window.addEventListener('click', hide)
}

const hide = (evt: any) => {
    if (evt.target === messageMenu.value) return

    isShow.value = false;
    window.removeEventListener('click', hide)
}


const menuOption = [
    {
        key: 'copy',
        icon: renderIcon(Copy)
    },
    {
        key: 'delete',
        icon: renderIcon(Trash)
    },
]
const onSelect = (key: string) => {
    // @ts-ignore
    emits(key, null)

}
defineExpose({ show })

</script>

<template>
    <Teleport to="body">
        <Transition>
            <div ref="messageMenu" v-show="isShow" class="message-menu" :style="{ top: y + 'px', left: x + 'px' }">
                <n-menu dropdown-placement="bottom" :collapsed-width="18" :root-indent="0" :indent="0" :icon-size="16"
                    mode="horizontal" :options="menuOption" accordion :on-update:value="onSelect" />
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.message-menu {
    position: absolute;
    width: fit-content;
    height: fit-content;
    background-color: var(--dropdown-bg);
    border-radius: 8px;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.message-menu:deep(.n-menu.n-menu--horizontal .n-menu-item-content) {
    padding: 0;
}

.message-menu:deep(.n-menu-item-content__icon) {
    margin: 0 8px !important;
}</style>