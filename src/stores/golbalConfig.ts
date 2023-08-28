import { defineStore } from 'pinia'

export const useGolBalConfigStore = defineStore('golbalConfig', {
  state: () => {
    return {
      globalTheme: 'light',
    }
  }
})