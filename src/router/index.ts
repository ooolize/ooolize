/*
 * @Description:
 * @Author: lize
 * @Date: 2023-11-20
 * @LastEditors: lize
 */
import { createRouter, createWebHistory } from "vue-router";

// @ts-ignore
import routes from "~pages";

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
