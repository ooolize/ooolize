<!--
 * @Description: 
 * @Author: lize
 * @Date: 2023-11-20
 * @LastEditors: lize
-->
<template>
  <div class="flex justify-between sticky">
    <div
      class="left-20 flex justify-evenly items-center right-20 w-1/2 h-16 my-6 relative"
    >
      <div v-for="title in navigatorList">
        <div
          class="cursor-pointer"
          :key="title.name"
          @click="$router.push(title.path)"
        >
          {{ $t(`navigator.${title.name}`) }}
        </div>
      </div>
    </div>

    <div class="flex justify-end items-center w-2/12">
      <img class="mx-1" src="@/assets/svg/lang.svg" alt="light mode" />
      <img
        class="mx-1"
        src="@/assets/svg/light.svg"
        alt="light mode"
        @click="changeStatus"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// import { ref } from "vue";
import { changeStatus } from "@/hooks/useDark";

const navigatorList = [
  {
    name: "blog",
    path: "/blog",
  },
  {
    name: "note",
    path: "/note",
  },
  {
    name: "demo",
    path: "/demo",
  },
  {
    name: "project",
    path: "/project",
  },
];
</script>

<style></style>
