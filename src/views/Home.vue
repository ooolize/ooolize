<!--
 * @Description: 
 * @Author: lize
 * @Date: 2023-11-20
 * @LastEditors: lize
-->
<template>
  <canvas ref="canvas" class="w-full h-screen"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const canvas = ref<HTMLCanvasElement>();

const draw = () => {
  if (!canvas.value) return;
  const ctx = canvas.value.getContext("2d")!;
  const x1 = canvas.value.width / 3;
  const y1 = canvas.value.height;

  const x2 = (canvas.value.width * 2) / 3;
  const y2 = canvas.value.height;

  const x3 = canvas.value.width;
  const y3 = 0;

  // 绘制三角形
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  // 填充颜色
  ctx.fillStyle = "red";
  ctx.fill();
};
onMounted(() => {
  // 获取屏幕宽度和高度
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // 设置 Canvas 的宽度和高度与屏幕相同
  canvas.value!.width = screenWidth;
  canvas.value!.height = screenHeight;
  draw();
});
// draw();
</script>

<style></style>
