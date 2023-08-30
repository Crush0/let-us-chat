import { defineStore } from 'pinia'

export const useGolBalConfigStore = defineStore('golbalConfig', {
  state: () => {
    return {
      globalTheme: 'light',
      noticePlay: true
    }
  },
  getters: {
    getNoticePlay:(state) => state.noticePlay  
  },
  actions:{
    setNoticePlay(val:boolean){
      this.noticePlay = val
    }
  }
})