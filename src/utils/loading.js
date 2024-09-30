import { createApp, reactive } from 'vue'
import Loading from 'views/loading.vue'
const divDom = document.createElement('div')
divDom.setAttribute('class', 'loading-container')
// document.body.appendChild(divDom)
const options = reactive({
  showToast: true,
  txt: '拼命加载中...',
})

//这里是关键部位options 是向Loading 组件传递的参数
const $loading = createApp(Loading, { options }).mount(divDom)

const loadPlguin = {
  show({ txt }) {
    // 控制显示loading的方法,这里是show方法传入的对象
    options.showToast = true
    options.txt = txt
    document.body.appendChild($loading.$el)
  },

  hide() {
    // 控制loading隐藏的方法
    options.showToast = false
  },
}
export default {
  install(app) {
    // 3.0的全局挂载
    app.config.globalProperties.$loading = loadPlguin
  },
}
