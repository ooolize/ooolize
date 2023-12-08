<!--
 * @Description: 
 * @Author: lize
 * @Date: 2023-11-20
 * @LastEditors: lize
-->

<template>
  <canvas ref="canvas" class="w-full h-screen z-0 fixed"></canvas>

  <div class="my-32 mx-32 text-generics">
    <div
      id="mainTitle"
      class="font-Mnxy text-6xl leading-10 font-semibold"
    ></div>
    <div class="mt-32 text-5xl">{{ $t("personIntro") }}</div>
    <div class="my-16 text-5xl">{{ $t("projectIntro") }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import i18n from "@/locales";

// @ts-ignore
import TypeIt from "typeit";

// const changeStatus = () => {
//   console.log("change");
// };
const canvas = ref<HTMLCanvasElement>();
// const mainTitle = ref<HTMLDivElement>();

// typeit的类型  TODO 为什么必须是any?
// type type1 = new TypeIt("", {});

const draw = () => {
  if (!canvas.value) return;
  const ctx = canvas.value.getContext("2d")!;
  const x1 = canvas.value.width / 3;
  const y1 = canvas.value.height;

  const x2 = (canvas.value.width * 2) / 3;
  const y2 = canvas.value.height;

  const x3 = canvas.value.width;
  const y3 = 0;

  const radioX = (canvas.value.width * 7) / 12;
  const radioY = canvas.value.height / 3;
  // 创建渐变
  const gradient = ctx.createRadialGradient(
    radioX,
    radioY,
    canvas.value.height / 40,
    radioX,
    radioY,
    canvas.value.height / 2
  );

  // 绘制三角形
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();

  // 增加红色透明度的线性渐变
  gradient.addColorStop(0, "rgba(255,70,70,1)");
  gradient.addColorStop(0.5, "rgba(255,70,70,0.4)");
  gradient.addColorStop(1, "rgba(255,70,70,0.1)");

  // 填充颜色
  ctx.fillStyle = gradient;
  ctx.fill();
};

// const { t } = useI18n();
console.log(i18n.global.t("mainTitle"));
onMounted(() => {
  // 获取屏幕宽度和高度
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // 设置 Canvas 的宽度和高度与屏幕相同
  canvas.value!.width = screenWidth;
  canvas.value!.height = screenHeight;
  draw();

  new (TypeIt as any)("#mainTitle", {
    strings: i18n.global.t("mainTitle"),
    speed: 75,
  }).go();
});
</script>

<style></style>
