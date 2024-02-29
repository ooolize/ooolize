<template>
  <div class="cursor-pointer" @click="onClickItem">{{ itemMsg.name }}</div>
</template>

<script setup lang="ts">
import type { bpItem } from "@/types";
import router from "@/router";

const props = defineProps<{
  itemMsg: bpItem;
}>();

const onClickItem = () => {
  console.log("onClickItem");
  const routerPath = "/demo/" + props.itemMsg.name;
  router.push(routerPath);
};
</script>

<style></style>
