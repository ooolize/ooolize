<!--
 * @Description: 
 * @Author: lize
 * @Date: 2023-11-09
 * @LastEditors: lize
-->
<script setup lang="ts">
import Header from "@/components/Header.vue";
import { isShowHeader } from "./hooks/useHeader";
</script>

<template>
  <Header v-show="isShowHeader" />
  <div class="h-20 w-full"></div>
  <router-view></router-view>
</template>

<style scoped></style>
