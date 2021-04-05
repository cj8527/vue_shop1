import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    NProgress.start()
    console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
axios.interceptors.response.use(config => {
    NProgress.done()
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)
Vue.filter('dateFormat', function (orginVal) {
    const dt = new Date(orginVal)
   const y = dt.getFullYear()
   const m = (dt.getMonth() + 1 + '').padStart(2, '0')
   const d = (dt.getDate() + '').padStart(2, '0')
   const hh = (dt.getHours() + '').padStart(2, '0')
   const mm = (dt.getMinutes() + '').padStart(2, '0')
   const ss = (dt.getSeconds() + '').padStart(2, '0')
   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
