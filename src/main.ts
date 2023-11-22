/*
 * @Description: 
 * @Author: lize
 * @Date: 2023-11-09
 * @LastEditors: lize
 */
import { createApp } from 'vue'
import '@/style.css'
import App from '@/App.vue'
import router from '@/router'
import i18n from '@/lang'

createApp(App).use(i18n).use(router).mount('#app')
