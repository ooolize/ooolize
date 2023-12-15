<!--
 * @Description: 
 * @Author: lize
 * @Date: 2023-12-06
 * @LastEditors: lize
-->
<template>
  <div class="fixed top-1/2 left-1/2">
    <div class="flex text-red-300 justify-center items-center">
      <div class="target text-transparent" v-for="char in text">{{ char }}</div>
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
// 调整 xDis 和 yDis 的类型为 Ref<number>
type RefPoint = {
  [K in keyof Point]: K extends "xDis" ? Ref<number> : Ref<Point[K]>;
};

const text = "hel~oWORLD";
let scrollMax: number = 1000;
let firstArrive = true;
let startHeight: Ref<number> = ref(0);
const alreadyScrollHeightFromStart: Ref<number> = ref(0);
const scrollHeight: Ref<number> = computed(() => {
  return alreadyScrollHeightFromStart.value > scrollMax ? scrollMax : alreadyScrollHeightFromStart.value;
});
const randomPoint: Record<string, RefPoint> = {}; // 随机点
const targetPoint: Record<string, Point> = {}; // 目标点
const initDisPoint: Record<string, Distance> = {}; // 初始距离
const rate: Ref<number> = computed(() => {
  return scrollHeight.value / toRef(scrollMax).value;
});

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
            (initDisPoint[cur] == undefined ? 0 : initDisPoint[cur].yDis) +
          alreadyScrollHeightFromStart.value
        );
      }),
    };
    return pre;
  }, {} as Record<string, RefDistance>)
);

// 判断所有random元素是否已经出现
const isAllRandomShow = () => {
  const elementList: NodeListOf<HTMLElement> =
    document.querySelectorAll(".random");
  let label = true;
  elementList.forEach((element) => {
    label = isInScreen(element);
  });
  return label;
};

// 计算初始距离
const calcInitDis = () => {
  for (const [text, point] of Object.entries(targetPoint)) {
    initDisPoint[text] = {
      xDis: point.x - randomPoint[text].x.value,
      yDis: point.y - randomPoint[text].y.value,
    };
  }
};

// 监听滚动事件
window.addEventListener("scroll", () => {
  if (isAllRandomShow()) {
    // 第一次来
    if (firstArrive) {
      calcInitDis();
      firstArrive = false;
      return;
    }
    // 在约定范围内 滚动响应
    alreadyScrollHeightFromStart.value = window.scrollY - startHeight.value;

    return;
  } else {
    startHeight.value = window.scrollY;
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
    element.style.top = `${Math.random() * 70}vh`;
    element.style.left = `${Math.random() * 30}vw`;
    // console.log(element.getBoundingClientRect());

    let elementPos = element.getBoundingClientRect();
    let text = element.innerText;
    randomPoint[text] = {
      x: toRef(elementPos.x),
      y: computed(() => {
        return elementPos.y - startHeight.value;
      }),
    };
  });
});
onUnmounted(() => {});

//
</script>

<style></style>
