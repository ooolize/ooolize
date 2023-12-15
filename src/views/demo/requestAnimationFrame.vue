<!--
 * @Description: 
 * @Author: lize
 * @Date: 2023-12-14
 * @LastEditors: lize
-->
<template>
  <div class="flex justify-center items-center absolute top-1/2 left-1/3">
    <div
      v-for="(color, index) in colors"
      :key="index"
      :style="{ backgroundColor: color }"
      class="w-48 h-48 mx-10"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from "vue";

const colors: Ref<string[]> = ref([]);
let frame = 0;

const animate = () => {
  // 在第1帧渲染红色div
  if (frame === 0) {
    colors.value.push("red");
  }
  // 在第5帧渲染蓝色div
  else if (frame === 4) {
    colors.value.push("blue");
  }
  // 在第10帧渲染绿色div
  else if (frame === 9) {
    colors.value.push("green");
  }

  // 更新帧数
  frame++;

  // 请求下一帧
  requestAnimationFrame(animate);
};

onMounted(() => {
  // 启动动画
  animate();
});
</script>

<style></style>
