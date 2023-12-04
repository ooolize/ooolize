<!--
 * @Description: 
 * @Author: lize
 * @Date: 2023-12-04
 * @LastEditors: lize
-->
<template>
  <div class="flex justify-center items-center">
    <div class="relative h-64 w-1/3 bg-red-400 over overflow-y-scroll">
      <div class="">
        <div class="w-40 h-64"></div>
        <div class="w-40 h-64"></div>
        <div class="w-40 h-64"></div>
      </div>
      <div class="flex justify-between">
        <div class="bar1 w-4 h-32 bg-yellow-200"></div>

        <div class="bar1 w-4 h-32 bg-yellow-200"></div>
      </div>
      <div class="">
        <div class="w-40 h-64"></div>
        <div class="w-40 h-64"></div>
        <div class="w-40 h-64"></div>
      </div>
    </div>
  </div>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    {{ inside }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
const inside = ref("outside");

// 使用IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      inside.value = "inside";
      // 元素进入视口 添加动画样式
      entry.target.classList.add("animate-bounce");
    } else {
      inside.value = "outside";
    }
  });
});
onMounted(() => {
  console.log("onMounted");
  // 获取bar1元素
  const barList = document.querySelectorAll("div.bar1");
  barList.forEach((bar) => {
    observer.observe(bar);
  });
});
</script>

<style>
.animate-bounce {
  /* background-color: blue; */
  animation: bounce 1s;
}
</style>
