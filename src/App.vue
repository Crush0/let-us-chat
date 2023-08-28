<script setup lang="ts">
import { RouterView } from 'vue-router'
import useSocket from './components/useSocket.vue';
import videoBG from '@/assets/7btrrd.mp4'
import { overrideTheme } from '@/customTheme'
</script>

<template>
  <div class="video-bg">
    <video :src="videoBG" width="320" height="240" autoplay loop muted />
  </div>
  <div class="main">

    <n-config-provider :theme-overrides="overrideTheme">
      <n-global-style />
      <n-message-provider>
        <n-dialog-provider>
          <use-socket>
            <div class="app-container" @contextmenu.prevent="() => { return false }">
              <RouterView />
            </div>
          </use-socket>
        </n-dialog-provider>
      </n-message-provider>
    </n-config-provider>


  </div>
</template>

<style>
.main {
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;
}

.video-bg {
  position: fixed;
  right: 0;
  top: 0;
  z-index: -100;
  width: 100%;
  height: 100%;
}

.video-bg video {
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
}

.app-container {
  background-color: var(--theme-bg-color);
  max-width: 1250px;
  max-height: 860px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  width: 100%;
  border-radius: 14px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  font-size: 15px;
  font-weight: 500;
}
</style>