<!--
 * @Description: 
 * @Author: lize
 * @Date: 2023-11-20
 * @LastEditors: lize
-->

<template>
  <div id="chapter1" class="relative h-screen w-full whitespace-nowrap">
    <!-- <div class="z-0 w-screen h-full bg-[url('@/assets/img/bg.png')] bg-no-repeat bg-center">
      <div id="mainTitle" class="font-Mnxy text-6xl leading-10 font-semibold"></div>
      <div class=" text-5xl">{{ $t("personIntro") }}</div>
      <div class="my-16 text-5xl">{{ $t("projectIntro") }}</div>
    </div> -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                font-bold text-[16rem]
                animate-[distinct_2s_ease-in]
                ">We Create
    </div>
  </div>
  <div id="content" class="">
    <div class="relative w-full my-16 h-16">
      <Divide class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" title="About Me" />
    </div>
    <div id="chapter2" class="  my-16 relative h-[70vh] ">
      <div class="  absolute my-16 left-1/4 w-1/2">
        <div id="mainTitle" class="font-sans text-6xl  font-semibold"></div>
        <div class="my-16   opacity-50 !important text-4xl leading-loose">{{ $t("personIntro") }}</div>
        <div class="my-8   opacity-50 !important text-4xl leading-loose">{{ $t("projectIntro") }}</div>

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

    <div class="relative w-full my-8 h-16">
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
import { showHeader } from "@/hooks/useHeader";
import i18n from "@/locales";

// @ts-ignore
import TypeIt from "typeit";
import type { projectItem } from "@/types";
const chooseProjectItem: Ref<projectItem> = ref(projectBp[0]);

// 深度遍历dom树 为参与渐入动画的元素标号
let count = 0;
const deepTraveral = (node: HTMLElement) => {

  count += 1;
  node.classList.add('slide-enter-content');
  node.style.setProperty('--stagger', count.toString());
  if (node.children.length === 0) {
    return;
  }
  for (let i = 0; i < node.children.length; i++) {
    deepTraveral(node.children[i] as HTMLElement);
  }
};

onMounted(() => {
  // 打字机
  new (TypeIt as any)("#mainTitle", {
    strings: i18n.global.t("mainTitle"),
    speed: 75,
  }).go();

  // 监听滚动事件 如果滚动大于某个位置就初始化元素符号
  window.addEventListener("scroll", () => {
    const node: HTMLElement = document.getElementById("content")!;
    showHeader()
    if (node.style.getPropertyValue("--stagger") === "") {
      deepTraveral(node);
      node.classList.add('slide-enter-content');
      node.style.setProperty('--stagger', "0");
    }
  });

});
</script>

<style></style>
