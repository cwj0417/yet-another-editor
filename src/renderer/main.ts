import { createApp, h, defineComponent } from 'vue'
import { createRouter, createWebHashHistory, RouterView } from 'vue-router'
import routes from 'virtual:generated-pages'

import './index.css'
const App = defineComponent({
    render () {
        return h(RouterView)
    }
})

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
})

const app = createApp(App)
app.directive('focus', { // 因为场景比较单一, 先不考虑removeEventListener. 如果需要做, 可以先写个方法和变量, 方法是调用变量的. mounted设置变量, 以达到remove方法.
    mounted(el) {
        el.focus()
        window.addEventListener("focus", () => {
            el.focus()
        })
    }
})
app.use(router)
app.mount('#app')
