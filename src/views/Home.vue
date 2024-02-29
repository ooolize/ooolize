<!--
 * @Description: 
 * @Author: lize
 * @Date: 2023-11-20
 * @LastEditors: lize
-->

<template>
  <div class="slide-enter-content">


    <div id="chapter1" class="relative h-screen w-full whitespace-nowrap">
      <!-- <div class="z-0 w-screen h-full bg-[url('@/assets/img/bg.png')] bg-no-repeat bg-center">
      <div id="mainTitle" class="font-Mnxy text-6xl leading-10 font-semibold"></div>
      <div class=" text-5xl">{{ $t("personIntro") }}</div>
      <div class="my-16 text-5xl">{{ $t("projectIntro") }}</div>
    </div> -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                font-Mnxy font-bold text-[16rem]
                animate-[distinct_2s_ease-in]
                ">We Create
      </div>
    </div>

    <div class="relative w-full my-16 h-4">
      <Divide class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" title="About Me" />
    </div>

    <div id="chapter2" class="slide-enter-content  my-16 relative h-[70vh] ">
      <div class="slide-enter-content  absolute my-16 left-1/4 w-1/2">
        <div id="mainTitle" class="font-Mnxy text-6xl  font-semibold"></div>
        <p class="my-16   opacity-50 text-4xl leading-loose">{{ $t("personIntro") }}</p>
        <p class="my-8   opacity-50 text-4xl leading-loose">{{ $t("projectIntro") }}</p>

        <div class="my-16 flex justify-start items-center">
          <img class="cursor-pointer " src="@/assets/svg/bilibili.svg" alt="哔哩哔哩" @click="" />
          <img class="ml-6  cursor-pointer " src="@/assets/svg/github.svg" alt="github" @click="" />
          <img class="ml-6  cursor-pointer " src="@/assets/svg/weibo.svg" alt="微博" @click="" />
          <img class="ml-6  cursor-pointer " src="@/assets/svg/twitter.svg" alt="twitter" @click="" />
        </div>
      </div>
      <div class="blur-[90px]  mix-blend-lighten -z-10 absolute right-[20%] h-[36rem] w-[36rem]" style="background-image: radial-gradient(
     ellipse 100% 100% ,
    rgba(255,70,70,0.5) 10px,
    rgba(0,0,0) 50%,
    beige
  );border-radius: 50%;"></div>

      <div class="blur-[90px] mix-blend-lighten -z-10 absolute top-[20%] right-[15%] h-[36rem] w-[36rem]" style="background-image: radial-gradient(
     ellipse 100% 100% ,
    rgba(255,70,70,0.5) 10px,
    rgba(255,70,70,0.2) 50%,
    beige
  );border-radius: 50%;"></div>
    </div>

    <div class="relative w-full my-8 h-4">
      <Divide class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" title="Project" />
    </div>


    <div id="chapter3" class="my-8 relative h-[70vh] ">
      <ProjectCard v-bind="chooseProjectItem"></ProjectCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted } from "vue";
import Divide from "@/components/Divide.vue";
import ProjectCard from "@/components/ProjectCard.vue";
import { projectBp } from "@/views/blue-print";
import i18n from "@/locales";

// @ts-ignore
import TypeIt from "typeit";
import type { projectItem } from "@/types";
const chooseProjectItem: Ref<projectItem> = ref(projectBp[0]);
// const canvas = ref<HTMLCanvasElement>();

// const draw = () => {
//   if (!canvas.value) return;
//   const ctx = canvas.value.getContext("2d")!;
//   const baseWidth = window.innerWidth;
//   const baseHeight = window.innerHeight;
//   const x1 = baseWidth / 3;
//   const y1 = baseHeight;

//   const x2 = (baseWidth * 2) / 3;
//   const y2 = baseHeight;

//   const x3 = baseWidth;
//   const y3 = 0;

//   const radioX = (baseWidth * 7) / 12;
//   const radioY = baseHeight / 3;
//   // 创建渐变
//   const gradient = ctx.createRadialGradient(
//     radioX,
//     radioY,
//     baseHeight / 40,
//     radioX,
//     radioY,
//     baseHeight / 2
//   );

//   // 绘制三角形
//   ctx.beginPath();
//   ctx.moveTo(x1, y1);
//   ctx.lineTo(x2, y2);
//   ctx.lineTo(x3, y3);
//   ctx.closePath();

//   // 增加红色透明度的线性渐变
//   gradient.addColorStop(0, "rgba(255,70,70,1)");
//   gradient.addColorStop(0.5, "rgba(255,70,70,0.4)");
//   gradient.addColorStop(1, "rgba(255,70,70,0.1)");

//   // 填充颜色
//   ctx.fillStyle = gradient;
//   ctx.fill();
// };

onMounted(() => {
  // 获取屏幕宽度和高度
  // const screenWidth = window.innerWidth;
  // const screenHeight = window.innerHeight;

  // // 设置 Canvas 的宽度和高度与屏幕相同
  // canvas.value!.width = screenWidth;
  // canvas.value!.height = screenHeight;
  // // draw();

  new (TypeIt as any)("#mainTitle", {
    strings: i18n.global.t("mainTitle"),
    speed: 75,
  }).go();
});
</script>

<style></style>
