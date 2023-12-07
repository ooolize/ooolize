<!--
 * @Description: 
 * @Author: lize
 * @Date: 2023-12-06
 * @LastEditors: lize
-->
<template>
  <div class="fixed top-1/2 left-1/2">
    <div class="flex justify-center items-center">
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
      <div
        class="relative random"
        :style="{
          transform: `translate(${scrollDis[char].xDis}px, ${scrollDis[char].yDis}px)`,
        }"
        v-for="char in text"
      >
        {{ char }}
      </div>
    </div>
    <div class="h-screen"></div>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  ref,
  Ref,
  reactive,
  computed,
  toRef,
} from "vue";
import { isInScreen } from "@/logic/utils";

interface Point {
  x: number;
  y: number;
}

interface Distance {
  xDis: number;
  yDis: number;
}
// 调整 xDis 和 yDis 的类型为 Ref<number>
type RefDistance = {
  [K in keyof Distance]: K extends "xDis" ? Ref<number> : Ref<Distance[K]>;
};

let startHeight: number = 0;
let scrollMax: number = 50;
const randomPoint: Record<string, Point> = {}; // 随机点
const targetPoint: Record<string, Point> = {}; // 目标点
const initDisPoint: Record<string, Distance> = {}; // 初始距离
const scrollHeight: Ref<number> = ref(0);
const rate: Ref<number> = computed(() => {
  return scrollHeight.value / toRef(scrollMax).value;
});
const text = "HELLOWORLD";

const scrollDis: Record<string, RefDistance> = reactive(
  text.split("").reduce((pre, cur) => {
    pre[cur] = {
      xDis: computed(() => {
        return (
          rate.value *
          (initDisPoint[cur] == undefined ? 0 : initDisPoint[cur].xDis)
        );
      }),
      yDis: computed(() => {
        return (
          rate.value *
          (initDisPoint[cur] == undefined ? 0 : initDisPoint[cur].yDis)
        );
      }),
    };
    return pre;
  }, {} as Record<string, RefDistance>)
);

// 判断所有random元素是否已经出现
let isAllRandomShow = () => {
  const elementList: NodeListOf<HTMLElement> =
    document.querySelectorAll(".random");
  let label = true;
  elementList.forEach((element) => {
    label = isInScreen(element);
  });
  return label;
};

// const observer = new IntersectionObserver((entries) => {
//   if (entries.length !== text.length) return;
//   isAllRandomShow = entries.every((entry) => {
//     // 如果都出现了 置位isAllRandomShow
//     return entry.isIntersecting;
//     // return true;
//   });
// });

let firstCross = true;
// 监听滚动事件
window.addEventListener("scroll", () => {
  if (isAllRandomShow()) {
    // 在约定范围内 滚动响应
    if (window.scrollY - startHeight < scrollMax) {
      scrollHeight.value = window.scrollY - startHeight;
      console.log(rate.value);
    } else if (firstCross) {
      scrollHeight.value = scrollMax;
      firstCross = false;
    }
    // console.log(scrollHeight.value);
    // console.log(scrollDis);
    return;
  } else {
    startHeight = window.scrollY;
  }
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
    // observer.observe(element);
  });
  // 计算距离
  for (const [text, value] of Object.entries(targetPoint)) {
    initDisPoint[text] = {
      xDis: value.x - randomPoint[text].x,
      yDis: value.y - randomPoint[text].y,
    };
    // scrollDis[text] = reactive({
    //   xDis: rate.value * toRef(initDisPoint[text].xDis).value,
    //   yDis: rate.value * toRef(initDisPoint[text].yDis).value,
    // });
  }
});
onUnmounted(() => {
  // observer.disconnect();
});

//
</script>

<style></style>
