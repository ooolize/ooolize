<!--
 * @Description: 
 * @Author: lize
 * @Date: 2023-11-20
 * @LastEditors: lize
-->
<template>
  <div class="h-20 w-full top-0 fixed z-50">
    <!-- <img src="@/assets/img/logo3.png" class="mx-4 my-4 w-20 h-20 fixed cursor-pointer" @click="$router.push(`/home`)"> -->
    <div class="flex justify-between ">
      <div class="left-20 flex justify-evenly items-center right-20 w-1/2 h-16 my-6 relative">
        <div v-for="title in navigatorList">
          <div class="cursor-pointer fixed" :key="title.name" @click="$router.push(title.path)">
            {{ $t(`navigator.${title.name}`) }}
          </div>
        </div>
      </div>

      <div class="flex  mx-10 justify-end items-center">
        <div class=" mx-6 ">
          <img class="cursor-pointer fixed " src="@/assets/svg/lang.svg" alt="light mode" @click="changeLang()" />
        </div>
        <div class=" mx-6 ">
          <img class="cursor-pointer fixed " src="@/assets/svg/light.svg" alt="light mode" @click="changeStatus" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { ref } from "vue";
import { changeStatus } from "@/hooks/useDark";
import { changeLang } from "@/hooks/useI18n";
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
