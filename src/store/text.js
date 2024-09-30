import { defineStore } from 'pinia'

export const useDevicesStore = defineStore('text', {
  state: () => ({
    message: 'hello world',
  }),

  getters: {
    getMessage(state) {
      return state.deviceType
    },
  },
  actions: {
    setMessage: (ctx) => {
      this.message = ctx
    },
  },
})
