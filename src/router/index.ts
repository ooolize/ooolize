/*
 * @Description: 
 * @Author: lize
 * @Date: 2023-11-20
 * @LastEditors: lize
 */
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', redirect: '/home' },
    { path: '/home', component: () => import('@/views/Home.vue') },
    { path: '/blog', component: () => import('@/views/Blog.vue') },
    { path: '/demo', component: () => import('@/views/Demo.vue') },
    { path: '/project', component: () => import('@/views/Project.vue') },
    { path: '/note', component: () => import('@/views/Note.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

export default router