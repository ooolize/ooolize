<!--
 * @Description: 
 * @Author: lize
 * @Date: 2023-12-06
 * @LastEditors: lize
-->
<template>
  <div class="fixed top-1/2 left-1/2">
    <div class="hidden flex justify-center items-center">
      <div class="target">H</div>
      <div class="target">E</div>
      <div class="target">L</div>
      <div class="target">L</div>
      <div class="target">O</div>
      <div class="target">W</div>
      <div class="target">O</div>
      <div class="target">R</div>
      <div class="target">L</div>
      <div class="target">D</div>
    </div>
  </div>
  <div class="w-1/3 absolute left-1/3">
    <div class="h-screen"></div>
    <div class="h-screen">
      <!-- <div class="flex justify-center items-center"> -->
      <div class="relative random">H</div>
      <div class="relative random">E</div>
      <div class="relative random">L</div>
      <div class="relative random">L</div>
      <div class="relative random">O</div>
      <div class="relative random">W</div>
      <div class="relative random">O</div>
      <div class="relative random">R</div>
      <div class="relative random">L</div>
      <div class="relative random">D</div>
    </div>
    <!-- </div> -->
    <div class="h-screen"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, Ref, reactive } from "vue";

interface Point {
  x: number;
  y: number;
}

interface Distance {
  xDis: number;
  yDis: number;
}

let baseHeight: number = 0;
let scrollMax: number = 300;
const randomPoint: Record<string, Point> = {};
const targetPoint: Record<string, Point> = {};
const initDisPoint: Record<string, Distance> = {};
const scrollHeight: Ref<number> = ref(0);
const scrollDis: Record<string, Distance> = reactive({});
// 全部random元素是否已经出现
let isAllRandomShow = false;

// 计算距离
for (const [text, value] of Object.entries(targetPoint)) {
  initDisPoint[text] = {
    xDis: randomPoint[text].x - value.x,
    yDis: randomPoint[text].y - value.y,
  };
}

const observer = new IntersectionObserver((entries) => {
  isAllRandomShow = entries.some((entry) => {
    // 如果都出现了 置位isAllRandomShow
    if (!entry.isIntersecting) {
      return false;
    }
    return true;
  });
});

// 监听滚动事件
window.addEventListener("scroll", () => {
  if (isAllRandomShow) {
    scrollHeight.value = window.scrollY;
    return;
  }
  baseHeight = window.scrollY;
});

onMounted(() => {
  // 处理target元素
  const targetElementList: NodeListOf<HTMLElement> =
    document.querySelectorAll(".target");

  targetElementList.forEach((element) => {
    let elementPos = element.getBoundingClientRect();
    let text = element.innerText;
    targetPoint[text] = {
      x: elementPos.x,
      y: elementPos.y,
    };
  });
  // 处理random元素
  const elementList: NodeListOf<HTMLElement> =
    document.querySelectorAll(".random");
  elementList.forEach((element) => {
    // 将className为random-x的元素,给予随机的位置
    element.style.top = `${Math.random() * 50}vh`;
    element.style.left = `${Math.random() * 30}vw`;
    console.log(element.getBoundingClientRect());

    let elementPos = element.getBoundingClientRect();
    let text = element.innerText;
    randomPoint[text] = {
      x: elementPos.x,
      y: elementPos.y,
    };

    // 监视所有的random元素是否已经出现
    observer.observe(element);
  });
});
onUnmounted(() => {
  observer.disconnect();
});

//
</script>

<style></style>
