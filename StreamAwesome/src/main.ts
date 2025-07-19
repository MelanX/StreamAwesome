import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import { loadFontAwesomeStyles } from './util/initFontAwesome'

await loadFontAwesomeStyles()

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
